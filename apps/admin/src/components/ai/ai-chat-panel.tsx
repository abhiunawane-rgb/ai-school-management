'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  answerFromSchoolSnapshot,
  getAiSuggestionPrompts,
  type SchoolAiSnapshot,
} from '@ai-school/shared';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Message = { id: string; role: 'user' | 'assistant'; text: string };

type AiChatPanelProps = {
  snapshot: SchoolAiSnapshot;
  subtitle?: string;
  compact?: boolean;
  onLiveChat?: (message: string) => Promise<string | null>;
};

function renderMarkdownLite(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < arr.length - 1 ? <br /> : null}
      </span>
    ));
  });
}

export function AiChatPanel({ snapshot, subtitle, compact, onLiveChat }: AiChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const suggestions = useMemo(() => getAiSuggestionPrompts(snapshot), [snapshot]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: answerFromSchoolSnapshot('hello', snapshot),
    },
  ]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function sendQuestion(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput('');
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const live = onLiveChat ? await onLiveChat(trimmed) : null;
      const reply = live ?? answerFromSchoolSnapshot(trimmed, snapshot);
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'assistant', text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: answerFromSchoolSnapshot(trimmed, snapshot),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card',
        compact ? 'min-h-[420px]' : 'min-h-[520px]'
      )}
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-ink-900 via-brand-800 to-brand-600 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 text-white">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold truncate">AI Assistant</p>
              <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-100 ring-1 ring-emerald-300/30">
                School data
              </span>
            </div>
            <p className="text-xs text-white/80 truncate">
              {subtitle ?? `${snapshot.schoolName} · live school data`}
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-3">
        <p className="mb-2 text-xs font-medium text-slate-500">Suggested questions</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {suggestions.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendQuestion(prompt)}
              disabled={loading}
              className="shrink-0 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 shadow-sm transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5 max-h-[380px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                msg.role === 'user' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
              )}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </span>
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-md'
                  : 'bg-slate-100 text-slate-800 rounded-tl-md'
              )}
            >
              {msg.role === 'assistant' ? renderMarkdownLite(msg.text) : msg.text}
            </div>
          </div>
        ))}
        {loading ? (
          <div className="flex gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <Bot className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-slate-100 bg-white p-3 sm:p-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about fees, homework, syllabus, events…"
            className="flex-1 h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()} className="h-11 gap-2 rounded-xl px-4">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
