module.exports = {
  title: 'Fed-docs',
  description: 'Hekr前端文档',
  themeConfig: {
    nav: [
      {
        text: '文档资源',
        items: [
          { text: 'hekr-cli', link: '/hekr-cli/index.html' },
          { text: 'hekr-h5-sdk', link: '/hekr-h5-sdk/index.html' },
          { text: 'hekr-components', link: '/hekr-components/index.html' },
          { text: 'auto', link: '/auto/index.html' }
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
