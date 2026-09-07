'use client'

import { useState } from 'react'
import '../../css/admin.css' // Вернули твои стили!

import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import AiEditor from '../../components/admin/AiEditor'
import AiPromptBox from '../../components/admin/AiPromptBox' // Вернули панель промпта!

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(false)
  const [articleData, setArticleData] = useState({
    title: '',
    tags: 'ai, nextjs',
    summary: '',
    content: '',
  })

  // Новая функция сохранения в SQLite
  const handlePublish = async () => {
    if (!articleData.title.trim() || !articleData.content.trim()) {
      alert('Введи заголовок и текст статьи!')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Ошибка публикации')

      alert('Отлично! Статья сохранена в базу данных.')
      // Очищаем форму, возвращая твои дефолтные теги
      setArticleData({ title: '', tags: 'ai, nextjs', summary: '', content: '' })
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-root">
      <div className="app">
        {/* Вернули твоё название проекта и подключили новую функцию */}
        <Header projectName="PandaH4ck Admin" onPublish={handlePublish} />

        <div className="layout-body">
          {/* Вернули твои пропсы в сайдбар */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="content-area">
            <AiEditor articleData={articleData} setArticleData={setArticleData} />

            {/* Панель ввода на месте */}
            <AiPromptBox />
          </div>
        </div>
      </div>
    </div>
  )
}
