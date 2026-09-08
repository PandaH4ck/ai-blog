import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { db } from '../../../lib/db'

export const dynamic = 'force-dynamic'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const rawTag = decodeURI(params.tag).trim().toLowerCase()
  const targetSlug = slug(rawTag)

  let allPosts: any[] = []
  let filteredPosts: any[] = []

  try {
    // 1. Достаем ВСЕ посты из базы данных для сайдбара
    const result = await db.execute(
      'SELECT id, title, slug, tags, content, createdAt FROM posts WHERE published = 1 OR published IS NULL ORDER BY createdAt DESC'
    )

    allPosts = result.rows.map((post: any) => ({
      slug: post.slug,
      date: post.createdAt,
      title: post.title,
      summary: post.summary || String(post.content).slice(0, 160) + '...',
      tags: post.tags
        ? String(post.tags)
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [],
      path: `blog/${post.slug}`,
    }))

    // 2. Отбираем только статьи с текущим тегом
    filteredPosts = allPosts.filter((post) =>
      post.tags.some((t: string) => {
        const currentTagSlug = slug(t)
        return (
          currentTagSlug === targetSlug || currentTagSlug === rawTag || t.toLowerCase() === rawTag
        )
      })
    )
  } catch (error) {
    console.error('Ошибка загрузки постов по тегу:', error)
  }

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  const title = rawTag[0].toUpperCase() + rawTag.slice(1).replace(/-/g, ' ')

  return (
    <ListLayout
      posts={allPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
    />
  )
}
