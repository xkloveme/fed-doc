module.exports = {
  title: 'Fed-docs',
  description: 'Hekr前端文档',
  themeConfig: {
    nav: [
      {
        text: '文档',
        items: [
          { text: 'hekr-cli', link: '/hekr-cli/' },
          { text: 'hekr-h5-sdk', link: '/hekr-h5-sdk/' },
          { text: 'hekr-components', link: '/hekr-components/' },
          { text: 'auto', link: '/auto/' }
        ]
      }
    ],
    sidebar: 'auto'
  },
  serviceWorker: true,
  dest: 'dist',
  markdown: {
    lineNumbers: true
  }
}
