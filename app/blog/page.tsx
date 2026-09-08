import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { db } from '../../lib/db'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const searchParams = await props.searchParams
  const pageNumber = parseInt(searchParams?.page || '1', 10)

  let posts: any[] = []

  try {
    // 1. Create the table automatically if the database was just removed.
    await db.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        tags TEXT,
        content TEXT NOT NULL,
        published INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // 2. The SELECT query can now run safely.
    const result = await db.execute(
      'SELECT * FROM posts WHERE published = 1 ORDER BY createdAt DESC'
    )

    posts = result.rows.map((post: any) => ({
      path: `blog/${post.slug}`,
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
    }))
  } catch (error) {
    console.error('Database error:', error)
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE) || 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  )
}
