import { NextResponse } from 'next/server'
// Используем прямой путь выхода из папок вместо алиаса @
import { db } from '../../../lib/db'

export async function POST(req: Request) {
  try {
    // 1. Автоматически создаем базу и таблицу, если их еще нет
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

    // 2. Достаем данные из запроса
    const { title, tags, content } = await req.json()

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Заголовок и текст обязательны' }, { status: 400 })
    }

    // 3. Генерируем URL статьи (slug)
    const slug = `${title.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '-')}-${Date.now()}`

    // 4. Сохраняем статью
    await db.execute({
      sql: 'INSERT INTO posts (title, slug, tags, content) VALUES (?, ?, ?, ?)',
      args: [title, slug, tags || '', content],
    })

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error('Ошибка БД:', error)
    return NextResponse.json({ error: 'Ошибка сохранения в базу' }, { status: 500 })
  }
}
