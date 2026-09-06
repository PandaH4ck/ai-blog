/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'PandaH4ck | Dev Blog',
  author: 'PandaH4ck',
  headerTitle: 'PandaH4ck',
  description:
    'Personal dev blog covering front-end engineering, computer networks, and hardware optimization.',
  language: 'ru-RU', // или 'uk-UA' / 'en-US' в зависимости от того, на каком языке посты
  theme: 'system', // 'system', 'dark' или 'light'
  siteUrl: 'https://pandah4ck.dev', // укажи свой домен, когда будет
  siteRepo: 'https://github.com/PandaH4ck/blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,

  // Контакты и социальные сети (заполни актуальные или оставь пустыми)
  email: 'pandah4ck@gmail.com',
  github: 'https://github.com/PandaH4ck',

  locale: 'en-US',
  stickyNav: false,

  analytics: {
    // Аналитику подключишь позже при необходимости (например, Umami или Google Analytics)
  },

  newsletter: {
    // Рассылка (если не нужна, можно оставить выключенной)
    provider: '',
  },

  comments: {
    // Комментарии через GitHub Discussions (Giscus)
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      lang: 'ru',
    },
  },

  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
