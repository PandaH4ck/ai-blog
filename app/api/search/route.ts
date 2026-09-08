import { NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'
import { db } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Posts from Markdown files (Contentlayer).
    const filePosts = allBlogs.map((post) => {
      const rawText = post.body?.raw || ''
      // Remove the leading slash because KBar adds it automatically.
      const cleanPath = (post.path || `blog/${post.slug}`).replace(/^\/+/, '')

      return {
        id: post.slug,
        title: post.title || 'Untitled',
        name: post.title || 'Untitled',
        date: post.date,
        tags: post.tags || [],
        path: cleanPath, // No leading slash, for example: "blog/my-post".
        summary: post.summary ? `${post.summary} ${rawText}` : rawText,
      }
    })

    // 2. Posts from the SQLite database.
    let dbPosts: any[] = []
    try {
      const result = await db.execute('SELECT * FROM posts ORDER BY id DESC')
      dbPosts = (result.rows || []).map((post: any) => {
        const rawSlug = String(post.slug || post.id).replace(/^\/+/, '')
        const cleanPath = rawSlug.startsWith('blog/') ? rawSlug : `blog/${rawSlug}`
        const contentText = post.content ? String(post.content) : ''
        const summaryText = post.summary ? String(post.summary) : ''
        const rawTags = post.tags
          ? String(post.tags)
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : []

        return {
          id: String(post.id),
          title: post.title || 'Untitled',
          name: post.title || 'Untitled',
          date: post.createdAt || new Date().toISOString(),
          tags: rawTags,
          path: cleanPath, // No leading slash, for example: "blog/my-post".
          summary: summaryText ? `${summaryText} ${contentText}` : contentText,
        }
      })
    } catch (dbError) {
      console.warn('SQLite search fetch warning:', dbError)
    }

    return NextResponse.json([...dbPosts, ...filePosts])
  } catch (error) {
    console.error('Search error in /api/search:', error)
    return NextResponse.json([])
  }
}
