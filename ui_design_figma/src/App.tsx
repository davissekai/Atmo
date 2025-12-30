import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessage } from './components/ChatMessage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ScrollArea } from './components/ui/scroll-area';
import { Button } from './components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Climate change basics',
      timestamp: 'Yesterday',
      messages: [],
    },
    {
      id: '2',
      title: 'Carbon footprint reduction',
      timestamp: '3 days ago',
      messages: [],
    },
    {
      id: '3',
      title: 'Renewable energy sources',
      timestamp: 'Last week',
      messages: [],
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(localStorage.getItem('atmo_session_id'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]); // Scroll on load too

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    localStorage.removeItem('atmo_session_id');
    setMessages([]);
  };

  const handleSessionSelect = (id: string) => {
    setActiveSessionId(id);
    localStorage.setItem('atmo_session_id', id);
    const session = sessions.find(s => s.id === id);
    setMessages(session?.messages || []);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          session_id: activeSessionId
        })
      });

      // Capture Session ID from header
      const sessionId = response.headers.get('X-Session-ID');
      if (sessionId) {
        setActiveSessionId(sessionId);
        localStorage.setItem('atmo_session_id', sessionId);
      }

      if (!response.ok) throw new Error('Atmo is having some trouble connecting. Please try again.');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No stream reader available.');

      const decoder = new TextDecoder();
      let assistantContent = "";

      // Add an empty assistant message to start streaming into
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        // Update the last message (which is our assistant message)
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            lastMsg.content = assistantContent;
          }
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I hit a snag: ${error.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onNewChat={handleNewChat}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={handleSessionSelect}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Chat Area */}
      <main
        className={`h-full transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-0'
          } flex flex-col`}
      >
        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <ScrollArea ref={scrollAreaRef} className="h-full">
              <div className="max-w-4xl mx-auto px-6 py-8">
                {messages.map((message) => (
                  <ChatMessage key={message.id} role={message.role} content={message.content} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] dark:from-[#1b4332] dark:to-[#0a0a0a] flex items-center justify-center shadow-lg shadow-[#90e0ef]/20">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="flex-1 max-w-3xl">
                      <div className="rounded-2xl px-5 py-4">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Input Area - Floating Pill */}
        <div className="relative pb-6 pt-4">
          {/* Gradient fade effect above input */}
          <div className="absolute bottom-full left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6">
            <div className="relative">
              {/* Frosted glass effect container */}
              <div className="absolute inset-0 bg-background/80 dark:bg-background/60 backdrop-blur-xl rounded-[28px] border border-border shadow-2xl shadow-black/10 dark:shadow-black/30" />

              {/* Input content */}
              <div className="relative flex items-end gap-3 px-5 py-3">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me about climate science..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground min-h-[44px] max-h-[200px] py-3"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-11 w-11 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-primary/20"
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary-foreground" />
                  ) : (
                    <Send className="w-5 h-5 text-primary-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Disclaimer text */}
            <p className="text-center text-xs text-muted-foreground mt-3">
              Atmo is an AI assistant. Always verify important climate information with scientific sources.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
