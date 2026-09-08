import { NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'
import { db } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 1. Статьи из Markdown-файлов (Contentlayer)
    const filePosts = allBlogs.map((post) => {
      const rawText = post.body?.raw || ''
      const url = `/${post.path}`

      return {
        id: post.slug,
        name: post.title || 'Untitled',
        keywords: `${post.summary || ''} ${rawText} ${(post.tags || []).join(' ')}`,
        section: 'Статьи',
        perform: () => (window.location.href = url),
        href: url,
        // Для обратной совместимости со старыми версиями Pliny:
        title: post.title,
        path: url,
        summary: post.summary || '',
        tags: post.tags || [],
        date: post.date,
      }
    })

    // 2. Статьи из базы данных SQLite
    let dbPosts: any[] = []
    try {
      const result = await db.execute('SELECT * FROM posts ORDER BY id DESC')
      dbPosts = (result.rows || []).map((post: any) => {
        const postSlug = post.slug || String(post.id)
        const contentText = post.content ? String(post.content) : ''
        const summaryText = post.summary ? String(post.summary) : ''
        const rawTags = post.tags
          ? String(post.tags)
              .split(',')
              .map((t: string) => t.trim())
              .filter(Boolean)
          : []
        const url = `/blog/${postSlug}`

        return {
          id: postSlug,
          name: post.title || 'Untitled',
          keywords: `${summaryText} ${contentText} ${rawTags.join(' ')}`,
          section: 'Статьи',
          perform: () => (window.location.href = url),
          href: url,
          // Совместимость:
          title: post.title,
          path: url,
          summary: summaryText,
          tags: rawTags,
          date: post.createdAt,
        }
      })
    } catch (dbError) {
      console.warn('SQLite fetch warning:', dbError)
    }

    return NextResponse.json([...dbPosts, ...filePosts])
  } catch (error) {
    console.error('Ошибка в поиске /api/search:', error)
    return NextResponse.json([])
  }
}
