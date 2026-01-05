import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Send,
  Menu,
  Search,
  User,
  Sparkles,
  ChevronDown,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  Lightbulb,
  MessageSquare,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function App() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8001/sessions');
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSessionSelect = async (id: string) => {
    setActiveSessionId(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    try {
      const res = await fetch(`http://127.0.0.1:8001/sessions/${id}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setInputValue('');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: inputValue };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const question = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8001/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, session_id: activeSessionId })
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
      setMessages([...currentMessages, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        assistantMessage.content += chunk;
        setMessages([...currentMessages, { ...assistantMessage }]);
      }

      fetchSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app-container">
      <div className="app">
        {/* Sidebar Overlay (mobile) */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <Plus />
              New chat
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-item">
              <Search />
              Search chats
            </div>
          </nav>

          <div className="sidebar-label">Recent</div>

          <div className="sidebar-content">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`history-item ${activeSessionId === session.id ? 'active' : ''}`}
                onClick={() => handleSessionSelect(session.id)}
              >
                {session.title}
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="px-3 py-4 text-xs text-[var(--text-muted)]">No chat history</div>
            )}
          </div>

          <div className="sidebar-footer">
            <div className="user-btn">
              <div className="user-avatar">U</div>
              <span className="text-sm font-medium">User</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <header className="header">
            <div className="header-left">
              <button
                className="icon-btn"
                onClick={toggleTheme}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
                <Menu />
              </button>
              <div className="logo">Atm<span>o</span></div>
            </div>
            <div className="header-right">
              <button className="icon-btn">
                <Bell />
              </button>
            </div>
          </header>

          {/* Messages Area / Welcome View */}
          {messages.length === 0 ? (
            <div className="content-area welcome-view">
              <div className="welcome">
                <h1>What can I help with?</h1>
              </div>

              <div className="prompts">
                <div className="prompt-pill" onClick={() => { setInputValue("What's causing temperature rise?"); setTimeout(handleSendMessage, 10); }}>
                  <span className="prompt-icon">🌡️</span>
                  <span className="prompt-text">What's causing temperature rise?</span>
                </div>
                <div className="prompt-pill" onClick={() => { setInputValue("How does climate change affect Ghana?"); setTimeout(handleSendMessage, 10); }}>
                  <span className="prompt-icon">🇬🇭</span>
                  <span className="prompt-text">Climate change in Ghana</span>
                </div>
                <div className="prompt-pill" onClick={() => { setInputValue("Explain the Harmattan season"); setTimeout(handleSendMessage, 10); }}>
                  <span className="prompt-icon">💨</span>
                  <span className="prompt-text">Explain Harmattan season</span>
                </div>
                <div className="prompt-pill" onClick={() => { setInputValue("How can I reduce my carbon footprint?"); setTimeout(handleSendMessage, 10); }}>
                  <span className="prompt-icon">🌱</span>
                  <span className="prompt-text">Reduce carbon footprint</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat-view active">
              <div className="messages" ref={scrollAreaRef}>
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.role}`}>
                    <div className="message-header">
                      <div className="message-avatar">
                        {message.role === 'assistant' ? 'A' : 'You'}
                      </div>
                      <span className="message-name">
                        {message.role === 'assistant' ? 'Atmo' : 'You'}
                      </span>
                    </div>
                    <div className="message-text">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message assistant">
                    <div className="message-header">
                      <div className="message-avatar">A</div>
                      <span className="message-name">Atmo</span>
                    </div>
                    <div className="message-text">
                      <div className="flex gap-1 pt-2">
                        <div className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="input-area">
            <div className="input-wrapper">
              <div className="input-pill">
                <button className="attach-btn">
                  <Plus />
                </button>
                <input
                  type="text"
                  placeholder="Ask anything"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button className="send-btn" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" color="white" />
                  ) : (
                    <Send />
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
