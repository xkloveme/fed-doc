module.exports = {
  title: 'Fed-docs',
  description: 'Hekr前端文档',
  themeConfig: {
    nav: [
      {
        text: 'Hekr-components',
        link: 'http://10.10.1.3:7777/hekr-components/index.html'
      },
      {
        text: 'Auto',
        link: 'http://10.10.1.3:7777/auto/index.html'
      }
    ],
    sidebar: 'auto',
    lastUpdated: '最后更新'
  },
  serviceWorker: true,
  markdown: {
    lineNumbers: true
  }
}
