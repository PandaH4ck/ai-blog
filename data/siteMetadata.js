/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: 'PandaH4ck | Dev Blog',
  author: 'PandaH4ck',
  headerTitle: 'PandaH4ck',
  description:
    'Personal dev blog covering front-end engineering, computer networks, and hardware optimization.',
  language: 'en-US',
  theme: 'system',
  siteUrl: 'https://pandah4ck.dev',
  siteRepo: 'https://github.com/PandaH4ck/blog',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,

  email: 'pandah4ck@gmail.com',
  github: 'https://github.com/PandaH4ck',

  locale: 'en-US',
  stickyNav: false,

  analytics: {},

  newsletter: {
    provider: '',
  },

  comments: {
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
      lang: 'en',
    },
  },

  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: '/api/search',
    },
  },
}

module.exports = siteMetadata
