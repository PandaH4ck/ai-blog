'use client'

import { useState } from 'react'
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/components/components/ui/message-scroller'

export default function AiChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Hi! I am your AI assistant. How can I help with posts, the sidebar, or code?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.reply || 'Response received.',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: 'API connection error.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[620px] max-w-xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl sm:max-w-xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Dialog header */}
        <DialogHeader className="flex-shrink-0 border-b border-gray-100 px-5 py-3.5 dark:border-zinc-800">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-zinc-100">
            <Sparkles className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            AI Assistant
          </DialogTitle>
          <DialogDescription className="sr-only">AI chat dialog</DialogDescription>
        </DialogHeader>

        {/* shadcn MessageScroller */}
        <div className="relative flex-1 overflow-hidden">
          <MessageScrollerProvider autoScroll defaultScrollPosition="last-anchor">
            <MessageScroller className="h-full">
              <MessageScrollerViewport id="messages-viewport">
                <MessageScrollerContent>
                  {messages.map((message) => {
                    const isUser = message.role === 'user'

                    return (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={isUser}
                      >
                        <div
                          className={`flex items-start gap-2.5 ${
                            isUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {!isUser && (
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-pink-200/50 bg-pink-50 text-pink-600 dark:border-pink-800/50 dark:bg-pink-950/40 dark:text-pink-400">
                              <Bot className="h-4 w-4" />
                            </div>
                          )}

                          <div
                            className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                              isUser
                                ? 'bg-pink-600 text-white shadow-sm'
                                : 'border border-gray-200/60 bg-gray-100 text-gray-900 dark:border-zinc-700/60 dark:bg-zinc-800 dark:text-gray-100'
                            }`}
                          >
                            {message.content}
                          </div>

                          {isUser && (
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </MessageScrollerItem>
                    )
                  })}

                  {loading && (
                    <div className="flex items-center gap-2 py-1 pl-9 text-xs text-gray-400 dark:text-zinc-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      AI is preparing a response...
                    </div>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>

              {/* Floating button shown when scrolled up */}
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </div>

        {/* Input footer */}
        <form
          onSubmit={handleSend}
          className="flex flex-shrink-0 items-center gap-2 border-t border-gray-100 bg-gray-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI..."
            disabled={loading}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-pink-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-100"
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading || !input.trim()}
            className="h-9 gap-1 rounded-lg bg-pink-600 px-3 text-white hover:bg-pink-700"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
