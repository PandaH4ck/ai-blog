'use client'

import { useState } from 'react'
import '../../css/admin.css'

import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import AiEditor from '../../components/admin/AiEditor'
import AiPromptBox from '../../components/admin/AiPromptBox' // Подключили панель ввода

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState('posts')
  const [articleData, setArticleData] = useState({
    title: '',
    tags: 'ai, nextjs',
    summary: '',
    content: '',
  })

  return (
    <div className="admin-root">
      <div className="app">
        <Header projectName="PandaH4ck Admin" onPublish={() => alert('Кнопка работает!')} />

        <div className="layout-body">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="content-area">
            <AiEditor articleData={articleData} setArticleData={setArticleData} />

            {/* Добавили компонент на страницу */}
            <AiPromptBox />
          </div>
        </div>
      </div>
    </div>
  )
}
