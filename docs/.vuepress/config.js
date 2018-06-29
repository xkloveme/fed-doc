module.exports = {
  title: 'Fed-docs',
  description: 'Hekr前端文档',
  themeConfig: {
    nav: [
      {
        text: '文档资源',
        items: [
          {
            text: 'hekr-cli',
            link: 'http://10.10.1.3:7777/hekr-cli/index.html'
          },
          {
            text: 'hekr-h5-sdk',
            link: 'http://10.10.1.3:7777/hekr-h5-sdk/index.html'
          },
          {
            text: 'hekr-components',
            link: 'http://10.10.1.3:7777/hekr-components/index.html'
          },
          {
            text: 'auto',
            link: 'http://10.10.1.3:7777/auto/index.html'
          }
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
