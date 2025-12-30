import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Earth, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`flex gap-4 mb-8 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isAssistant
            ? 'bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] dark:from-[#1b4332] dark:to-[#0a0a0a] shadow-lg shadow-[#90e0ef]/20'
            : 'bg-muted'
          }`}
      >
        {isAssistant ? (
          <Earth className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isAssistant ? 'max-w-3xl' : 'max-w-3xl ml-auto'}`}>
        <div
          className={`rounded-2xl px-5 py-4 ${isAssistant
              ? 'bg-transparent'
              : 'bg-muted shadow-sm'
            }`}
        >
          {isAssistant ? (
            <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
