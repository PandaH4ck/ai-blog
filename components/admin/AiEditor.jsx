'use client'

import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
  ssr: false,
})

const AiEditor = ({ articleData, setArticleData }) => {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <input
        type="text"
        placeholder="Article Title..."
        value={articleData?.title || ''}
        onChange={(e) => setArticleData((prev) => ({ ...prev, title: e.target.value }))}
        className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-600"
      />

      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-gray-400">#</span>
        <input
          type="text"
          placeholder="hardware, optimization, gpu"
          value={articleData?.tags || ''}
          onChange={(e) => setArticleData((prev) => ({ ...prev, tags: e.target.value }))}
          className="w-full border-none bg-transparent text-sm text-gray-600 placeholder:text-gray-400 focus:ring-0 focus:outline-none dark:text-gray-400 dark:placeholder:text-gray-600"
        />
      </div>

      <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />

      <div data-color-mode="auto" className="w-full">
        <MDEditor
          value={articleData?.content || ''}
          onChange={(val) => setArticleData((prev) => ({ ...prev, content: val || '' }))}
          height={550}
          preview="live"
          visibleDragbar={false}
          previewOptions={{
            className: 'prose dark:prose-invert max-w-none text-sm',
          }}
        />
      </div>
    </section>
  )
}

export default AiEditor
