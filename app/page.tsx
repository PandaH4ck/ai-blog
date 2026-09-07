import { db } from '../lib/db'
import Main from './Main'

// Отключаем жесткий кеш, чтобы новые статьи из админки сразу появлялись на главной
export const dynamic = 'force-dynamic'

export default async function Page() {
  let posts: any[] = []

  try {
    // 1. Достаем опубликованные статьи ТОЛЬКО из SQLite
    const result = await db.execute(
      'SELECT id, title, slug, tags, content, createdAt FROM posts WHERE published = 1 ORDER BY createdAt DESC'
    )

    // 2. Преобразуем строки из базы в формат, который ожидает твой Main
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
    console.error('Ошибка загрузки постов для главной страницы:', error)
  }

  // Твой оригинальный фронтенд без единого изменения в дизайне
  return <Main posts={posts} />
}
