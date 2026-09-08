'use client'

import { useState, useEffect } from 'react'
import { Search, Trash2, Loader2, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function PostsManagerModal({ isOpen, onClose }) {
  const [posts, setPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setSearchQuery('')
      fetch('/api/posts')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setPosts(data)
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [isOpen])

  const handleDelete = async (e, id, title) => {
    e.stopPropagation()
    if (!confirm(`Delete the post "${title}"?`)) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/posts?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert('Failed to delete the post')
      }
    } catch (err) {
      console.error(err)
      alert('Connection error')
    } finally {
      setDeletingId(null)
    }
  }

  // Filter posts by the search query.
  const filteredPosts = posts.filter((post) =>
    (post.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-2xl sm:max-w-xl dark:border-zinc-800 dark:bg-zinc-900">
        <DialogTitle className="sr-only">Manage posts</DialogTitle>
        <DialogDescription className="sr-only">
          List of posts from the SQLite database
        </DialogDescription>

        {/* Search row styled like KBar */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 dark:border-zinc-800">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter posts..."
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded border border-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-400 hover:text-gray-600 dark:border-zinc-700 dark:hover:text-gray-200"
          >
            ESC
          </button>
        </div>

        {/* Section heading */}
        <div className="px-5 pt-3 pb-1 text-[11px] font-bold tracking-wider text-pink-600 uppercase dark:text-pink-400">
          CONTENT ({filteredPosts.length})
        </div>

        {/* Post list */}
        <div className="max-h-[380px] overflow-y-auto px-2 pb-3">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              {posts.length === 0 ? 'No posts in the database' : 'No posts found'}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredPosts.map((post) => {
                const dateStr = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent'

                const isDeleting = deletingId === post.id

                return (
                  <div
                    key={post.id}
                    className="group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-colors hover:bg-pink-600 hover:text-white"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      {/* Date above the post */}
                      <p className="text-[12px] text-gray-400 group-hover:text-pink-100 dark:text-zinc-500">
                        {dateStr}
                      </p>
                      {/* Post title */}
                      <h4 className="truncate text-sm font-medium text-gray-900 group-hover:text-white dark:text-gray-100">
                        {post.title || 'Untitled'}
                      </h4>
                    </div>

                    {/* Delete button */}
                    <button
                      disabled={isDeleting}
                      onClick={(e) => handleDelete(e, post.id, post.title)}
                      title="Delete post"
                      className="shrink-0 rounded-lg p-1.5 text-gray-400 opacity-80 transition group-hover:text-white hover:bg-white/20 hover:text-white disabled:opacity-40"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
