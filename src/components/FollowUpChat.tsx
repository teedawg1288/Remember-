import React, { useState } from 'react';
import { TranslationResult, ChatMessage } from '../types/translation';
import { Send, Loader2, Sparkles, MessageSquare, Bot, User } from 'lucide-react';

interface FollowUpChatProps {
  translation: TranslationResult;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
}

const QUICK_QUESTIONS = [
  'Where does this analogy break down the most?',
  'Can you give me an example I might run into this week?',
  'How would I explain this simply to a 10-year-old?',
  'What should I be careful not to confuse here?',
];

export const FollowUpChat: React.FC<FollowUpChatProps> = ({
  translation,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input.trim();
    setInput('');
    onSendMessage(query);
  };

  const handleQuickQuestion = (q: string) => {
    if (isLoading) return;
    onSendMessage(q);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
            Contextual Inquiry
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
            Ask a Follow-Up Question
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Probe deeper, ask about edge cases, or adjust the comparison without losing your context.
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-900 shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
      </div>

      {/* Message history */}
      {messages.length > 0 && (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center shrink-0 mt-0.5 text-xs font-serif font-bold">
                  10
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-stone-50 rounded-br-xs'
                    : 'bg-stone-50 text-stone-800 border border-stone-200/80 rounded-bl-xs'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-stone-500 py-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>Adjusting explanation to your question...</span>
            </div>
          )}
        </div>
      )}

      {/* Suggested prompts */}
      <div className="pt-1">
        <span className="text-xs text-stone-500 block mb-2 font-medium">
          Quick follow-up angles:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickQuestion(q)}
              className="text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors text-left disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex gap-2 items-center pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything about ${translation.unfamiliarTopic}...`}
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-stone-900 text-sm placeholder:text-stone-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="min-h-[46px] min-w-[46px] px-4 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white font-medium text-sm transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-[0.98]"
          title="Send question"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Ask</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
