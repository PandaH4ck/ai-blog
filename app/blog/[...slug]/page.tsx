import 'css/prism.css'
import 'katex/dist/katex.css'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { coreContent } from 'pliny/utils/contentlayer'
import { allAuthors } from 'contentlayer/generated'
import type { Authors } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'
import { db } from '../../../lib/db'

export const dynamic = 'force-dynamic'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  const result = await db.execute({
    sql: 'SELECT * FROM posts WHERE slug = ? AND published = 1 LIMIT 1',
    args: [slug],
  })
  const post = result.rows[0] as any
  if (!post) return

  const authorResults = allAuthors.find((p) => p.slug === 'default')
  const authorDetails = authorResults ? [coreContent(authorResults as Authors)] : []
  const publishedAt = new Date(post.createdAt).toISOString()
  const authors = authorDetails.map((author) => author.name)

  return {
    title: post.title,
    description: post.summary || String(post.content).slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.summary || String(post.content).slice(0, 160),
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      url: './',
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
  }
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))

  const allResult = await db.execute(
    'SELECT id, title, slug, tags, content, createdAt FROM posts WHERE published = 1 ORDER BY createdAt DESC'
  )

  const sortedCoreContents = allResult.rows.map((p: any) => ({
    path: `blog/${p.slug}`,
    slug: p.slug,
    date: p.createdAt,
    title: p.title,
  }))

  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allResult.rows[postIndex] as any

  const authorResults = allAuthors.find((p) => p.slug === 'default')
  const authorDetails = authorResults ? [coreContent(authorResults as Authors)] : []

  const mainContent = {
    title: post.title,
    date: post.createdAt,
    tags: post.tags
      ? String(post.tags)
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [],
    slug: post.slug,
    path: `blog/${post.slug}`,
  }

  const Layout = layouts[defaultLayout]

  return (
    <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
      {/* Класс prose отвечает за красивые отступы, шрифты и оформление Markdown в Tailwind */}
      <div className="prose dark:prose-invert max-w-none pt-10 pb-8 text-gray-800 dark:text-gray-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </Layout>
  )
}
