import { NextResponse } from 'next/server'
import { db } from '../../../lib/db'

export const dynamic = 'force-dynamic'

// 1. Return all posts from the SQLite database for the management modal.
export async function GET() {
  try {
    const result = await db.execute('SELECT id, title, slug, createdAt FROM posts ORDER BY id DESC')
    return NextResponse.json(result.rows || [])
  } catch (error: any) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// 2. Create a post from the editor form.
export async function POST(req: Request) {
  try {
    // Create the database table when it does not exist yet.
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

    // Read the submitted post data.
    const { title, tags, content } = await req.json()

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Generate the post URL slug.
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}-${Date.now()}`

    // Save the post.
    await db.execute({
      sql: 'INSERT INTO posts (title, slug, tags, content) VALUES (?, ?, ?, ?)',
      args: [title, slug, tags || '', content],
    })

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to save the post' }, { status: 500 })
  }
}

// 3. Delete the selected post by ID.
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    await db.execute({
      sql: 'DELETE FROM posts WHERE id = ?',
      args: [id],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete post:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
