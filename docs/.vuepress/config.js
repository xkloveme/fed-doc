module.exports = {
  title: 'Fed-docs',
  description: 'Hekr前端文档',
  themeConfig: {
    nav: [
      {
        text: 'Hekr-components',
        link: 'http://10.10.1.2:7777/hekr-components/index.html'
      },
      {
        text: 'Auto',
        link: 'http://10.10.1.2:7777/auto/index.html'
      }
    ],
    sidebar: 'auto',
    lastUpdated: '最后更新',
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'http://gitlab.hekr.me/front-end/fed-docs',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: '查看源码',

    // 以下为可选的编辑链接选项
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！'
  },
  serviceWorker: true
}
