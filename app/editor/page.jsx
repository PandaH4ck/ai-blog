'use client'

import { useState } from 'react'
import '../../css/admin.css'

import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import AiEditor from '../../components/admin/AiEditor'
import AiPromptBox from '../../components/admin/AiPromptBox'

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(false)
  const [articleData, setArticleData] = useState({
    title: '',
    tags: 'ai, nextjs',
    summary: '',
    content: '',
  })

  const handlePublish = async () => {
    if (!articleData.title.trim() || !articleData.content.trim()) {
      alert('Enter a post title and content!')
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

      if (!res.ok) throw new Error(data.error || 'Publishing failed')

      alert('Success! The post was saved to the database.')
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
        <Header projectName="PandaH4ck Admin" onPublish={handlePublish} />

        <div className="layout-body">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="content-area">
            <AiEditor articleData={articleData} setArticleData={setArticleData} />

            <AiPromptBox />
          </div>
        </div>
      </div>
    </div>
  )
}
