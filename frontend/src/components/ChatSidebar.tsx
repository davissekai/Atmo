import { Plus, MessageSquare, Settings, Moon, Sun, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (id: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function ChatSidebar({
  isOpen,
  onToggle,
  onNewChat,
  sessions,
  activeSessionId,
  onSessionSelect,
  isDarkMode,
  onToggleTheme,
}: ChatSidebarProps) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-72' : 'w-0'
          }`}
      >
        <div className={`flex flex-col h-full pt-8 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          {/* Header with New Chat button */}
          <div className="p-4 border-b border-sidebar-border">
            <Button
              onClick={onNewChat}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 rounded-full h-11"
            >
              <Plus className="w-5 h-5" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs text-muted-foreground">Chat History</div>
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 group ${activeSessionId === session.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                    }`}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0 opacity-60" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-sm">{session.title}</div>
                    <div className="text-xs text-muted-foreground">{session.timestamp}</div>
                  </div>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No chat history yet
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer with Settings and Theme Toggle */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            <Button
              variant="ghost"
              onClick={onToggleTheme}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>
      </aside>

      {/* Toggle Button - visible when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border hover:bg-sidebar-accent transition-colors"
          aria-label="Open sidebar"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Collapse Button - visible when sidebar is open */}
      {isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-[17rem] top-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border hover:bg-sidebar-accent transition-colors"
          aria-label="Close sidebar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
