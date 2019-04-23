module.exports = {
  title: 'Fed-docs',
  description: 'Hekr前端文档',
  themeConfig: {
    nav: [
      {
        text: 'Hekr-components',
        link: 'http://10.10.1.2:7777/hekr-components/'
      },
      {
        text: 'Auto',
        link: 'http://10.10.1.2:7777/auto/'
      },
      {
        text: 'SDK',
        link: '/sdk/'
      },
      {
        text: 'layer',
        link: 'http://10.10.1.2:7777/layer/'
      }
    ],
    sidebar: 'auto',
    lastUpdated: '最后更新',
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'http://gitlab.hekr.me/front-end/fed-docs',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'GitLab',
    // 以下为可选的编辑链接选项
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！'
  },
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { permalink: true },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2] },
    extendMarkdown: md => {
      // 使用更多的 markdown-it 插件!
      md.use(require('markdown-it-checkbox')).use(require('markdown-it-kbd'))
    }
  },
  plugins: ['@vuepress/back-to-top', '@vuepress/medium-zoom'],
  serviceWorker: true
}
