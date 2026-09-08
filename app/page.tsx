import { db } from '../lib/db'
import Main from './Main'

// Disable the hard cache so new admin posts appear on the home page immediately.
export const dynamic = 'force-dynamic'

export default async function Page() {
  let posts: any[] = []

  try {
    // 1. Read published posts only from SQLite.
    const result = await db.execute(
      'SELECT id, title, slug, tags, content, createdAt FROM posts WHERE published = 1 ORDER BY createdAt DESC'
    )

    // 2. Transform database rows into the format expected by Main.
    posts = result.rows.map((post: any) => ({
      slug: post.slug,
      date: post.createdAt,
      title: post.title,
      summary: post.summary || (post.content ? String(post.content).slice(0, 160) + '...' : ''),
      tags: post.tags
        ? String(post.tags)
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [],
      path: `blog/${post.slug}`,
    }))
  } catch (error) {
    console.error('Failed to load posts for the home page:', error)
  }

  return <Main posts={posts} />
}
