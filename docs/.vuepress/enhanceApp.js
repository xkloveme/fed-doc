export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router // the router instance for the app
}) => {
  // ...apply enhancements to the app
  const push = router.push

  // 修复路由匹配错误问题
  router.push = (route, ...args) => {
    push.call(
      router,
      {
        ...route,
        path: decodeURI(route.path)
      },
      ...args
    )
  }
}
