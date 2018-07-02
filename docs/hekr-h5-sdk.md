# hekr-h5-sdk

> 氦氪前端开发工具库

## 属性

所有属性除了`options`之外，其余都只能在`ready`之后调用

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| app | object | app相关信息 |
| URL | object | api请求相关的地址 |
| device | object | 设备相关的数据 |
| options | object | 从地址栏获取到的参数和初始化传递进入类的参数 |
| fetch | object | api相关请求挂载的对象 |
| i18nUI | object | 自动化布局相关配置 |
| template | object | 设备协议 |
| support | obejct | 当前环境支持的特性 | 

support属性: 用于探测是否支持某个方法，如大可设备详情页面在旧版本App上不支持，所以应在页面上隐藏
可参考：
  1. http://gitlab.hekr.me/i18nUI/air-cleaner/blob/e5986af1362e933c64fe884adcbb398b476e2046/src/views/home.vue#L5
  2. http://gitlab.hekr.me/i18nUI/air-cleaner/blob/e5986af1362e933c64fe884adcbb398b476e2046/src/views/home.vue#L79
  3. http://gitlab.hekr.me/i18nUI/air-cleaner/blob/e5986af1362e933c64fe884adcbb398b476e2046/src/views/home.vue#L127
  4. http://gitlab.hekr.me/i18nUI/air-cleaner/blob/e5986af1362e933c64fe884adcbb398b476e2046/src/views/home.vue#L258
```js
{
  openPage: true/false
}
```

## 方法

| 名称 | 参数 | 返回值 | 说明 |
| --- | --- | --- | --- |
| close | - | - | 关闭页面 |
| decode |  | object/string | 解码数据 |
| emit | (enent: string) | - | 触发事件 |
| encode |   | object/string | 编码数据 |
| off | (enent: string, fn: function) | - | 移除事件监听 |
| on | (enent: string, fn: function) | - | 添加事件监听 |
| once | (enent: string, fn: function) | - | 只监听一次事件 |
| query | (...arg: string) | object | 获取地址栏search数据字段 |
| send | (data: object) | - | 发送数据到云端 |
| setStatusBarColor | (color: string) | - | 设置状态栏颜色，颜色格式为16进制形式，如`setStatusBarColor('#0088ff')` |
| openPage | (page?: string, params?: object) | - | 打开App原生页面, 如果不传参数默认打开设备详情页面 |
| ready | (callback?: function) | Promise\<void\> | sdk准备完毕之后运行回调，如果失败会让Promise reject |

## 事件

| 名称 | 回调参数 | 说明 |
| --- | --- | --- |
| loading | 返回boolean值，用来控制是否显示加载中浮层 | 控制命令下发超时的时候浮层显示控制 |
| online | - | 设备上线 |
| offline | - | 设备离线 |
| error | 错误帧内容 | 收到errorResp帧时触发 |
| back | - | 安卓设备点击物理返回键时触发 |
| devSend | 1.设备上报帧信息，2.设备上报数据解码之后的内容 | 接收到上报帧时触发 |
| [上报帧名称] | 上报数据内容 | 收到上报帧后触发，事件名称为上报帧的cmdtTag |

## 使用

在使用模块化的开发方式时，推荐使用 NPM 安装 SDK，能够和 [Webpack](http://webpack.github.io/) 等模块打包器配合使用。

``` bash
# 更改 npm 源
$ npm config set registry http://npm.hekr.me

# 稳定版
$ npm install @hekr/hekr-h5-sdk

# 开发版
$ npm install @hekr/hekr-h5-sdk@beta
```

之后，在项目文件中注入以下代码。

``` js
// main.js
import { Hekr, Matrix } from '@hekr/hekr-h5-sdk'

// 调试时才会运行，生成环境不会有
if (process.env.NODE_ENV !== 'production') {
  const keys = require('../keys.json')
  // 这里也可以传入参数重写URL地址
  window.Matrix = new Matrix({
    ...keys, // 传入devTid，token等信息
    URL: { // 重写默认URL地址，没有传的就是用默认值
      ws: 'wss://asia-app.hekr.me:186', // websocket地址
      uaa: 'https://uaa-openapi.hekr.me', // uaa地址
      user: 'https://user-openapi.hekr.me', // user地址
      console: 'https://console-openapi.hekr.me' // console地址
    }
  })
}

Vue.prototype.$Hekr = window.$Hekr = new Hekr({
  query: { // 定义发送自动查询
    frame: { // 查询帧的帧内容
      cmdId: 0
    },
    duration: 30, // 查询自动查询帧时间间隔
    auto: true, // 是否自动循环发送
    timeService: [], // 授时查询，当项目需要在查询帧中带上授时时修改此参数，可选时间参数有 `year`, `month`, `week`, `day`, `hour`, `minute`
    fn: frame => frame // 查询帧函数，当授时查询不能满足项目需求或其他情况时，在此参数中传入一个函数，在查询发送前进行最后的修改操作。
  },
  protocol: ,// 协议，传入此参数就不需要再向云端请求协议
  decode: raw => raw, // 帧的解码函数
  encode: data => data.raw, // 帧的编码函数
  i18nUI: false // 定义是否去拉取i18nUI配置，默认不拉取
})
```

## 参数信息

当 SDK 启动后，在此对象中可以获取与当前用户和设备有关的参数，用于请求等。

### URL

`Hekr`请求api域
``` js
{
  ws: 'wss://asia-app.hekr.me:186',
  uaa: 'https://uaa-openapi.hekr.me',
  user: 'https://user-openapi.hekr.me',
  console: 'https://console-openapi.hekr.me'
}
```

### options

`Hekr`请求api域
``` js
{
  appId: '', // 地址栏获取的appId
  lang: '',  // 地址栏获取的lang
  devTid: '', // 地址栏获取的devTid
  subDevTid: '', // 地址栏获取的subDevTid
  group: true/false, // 地址栏获取的group参数，表示是否为群控
  groupId: '', // 地址栏获取的groupId
  runVirtual: runVirtual ? Number(runVirtual) : 0, // 地址栏获取的runVirtual参数，为1表示运行虚拟设备，为0不运行
  /**
   * 以下内容是hekr初始化时传进来的参数与默认值合并之后的内容
   */
  query: { // 定义发送自动查询
    frame: { // 查询帧的帧内容
      cmdId: 0
    },
    duration: 30, // 查询自动查询帧时间间隔
    auto: true, // 是否自动循环发送
    timeService: [], // 授时查询，当项目需要在查询帧中带上授时时修改此参数，可选时间参数有 `year`, `month`, `week`, `day`, `hour`, `minute`
    fn: frame => frame, // 查询帧函数，当授时查询不能满足项目需求或其他情况时，在此参数中传入一个函数，在查询发送前进行最后的修改操作。
  },
  protocol: null,// 协议，传入此参数就不需要再向云端请求协议
  decode: raw => raw, // 帧的解码函数
  encode: data => data.raw, // 帧的编码函数
  i18nUI: false
}
```

### fetch

`Hekr`发送请求的Api，可直接调用`$hekr.fetch({...})`发送请求，使用方式和[axios](https://github.com/axios/axios)一样(就是对axios的封装)，使用示例可参考[云端 API部分](#yunduanAPI)
```js
{
  QRCode: { // 授权二维码
    get: Function,
    format: Function
  },
  preferences: { // 偏好
    get: Function,
    set: Function,
    format: Function
  },
  schedulerTask: { // 预约
    get: Function,
    set: Function,
    del: Function,
    format: Function
  },
  snapshot: { // 快照
    get: Function,
    format: Function
  },
  statistics: { // 统计数据
    get: Function,
    format: Function
  },
  warnings: { // 告警日志
    get: Function,
    format: Function
  },
  weather: { // 天气接口
    get: Function,
    format: Function
  },
  device: Function, // 拉取设备
  protocol: Function // 拉取协议
}
```

### app

用户信息参数在 `Hekr.app` 中查看。
``` js
{
  appTid: '...',
  token: '...',
  mode: 'Cloud/LAN',
  network: 'WiFi/WWAN/NotReachable',
  platform: 'iOS/Android'
}
```

### device

设备信息参数在 `Hekr.device` 中查看，格式详见 [列举设备列表](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI%E6%80%BB%E8%A7%88/#412)。

``` js
{
  device: {
    deviceName: '...',
    devTid: '...',
    ...
  }
}
```

### template

协议信息参数在 `Hekr.template` 中查看，格式详见 [获取产品协议模板](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI%E6%80%BB%E8%A7%88/#59)。

``` js
{
  template: {
    protocol: {
      ...
    },
    workModeType: '...',
    ...
  }
}
```

## 设备通信

针对不同的项目，在 [console](https://console.hekr.me) 平台对应的产品页面中，会建立不同的协议模板，SDK 根据这个协议模板来进行协议的编码和解码。

例如，某产品有如下协议模板：

### 参数

| 名称 | 类型   | 单位 | 取值范围      | 参数描述 |
|:-----|:-------|:-----|:--------------|:---------|
| sw   | NUMBER |      | · 0 关 · 1 开 | 开关     |

### 命令

| 名称      | 命令ID | 帧类型 | 示例帧 | 命令描述     |
|:----------|:-------|:-------|:-------|:-------------|
| queryDev  | 0      | 下发帧 | 查看   | 设备状态查询 |
| reportDev | 1      | 上报帧 | 查看   | 上报设备状态 |
| setSw     | 2      | 下发帧 | 查看   | 设置开关     |

通常，当设备接收到 `queryDev` 的查询帧，或 `setSw` 的下发帧导致设备状态改变时，设备会主动发送 `reportDev` 的上报帧。

### 发送数据

调用 `Hekr.send` 方法来发送数据，传入一个带有命令名称 `cmdTag` 和命令所需参数的对象，SDK 会自动根据协议类型进行编码并发送。其中，命令名称 `cmdTag: 'setSw'` 也可以替换成命令ID `cmdId: 2`，但建议使用命令名称 `cmdTag`。

``` js
$Hekr.send({
  cmdTag: 'setSw',
  sw: 1
})
```

此外，发送数据时的 `action` 默认为 `appSend`，当项目为群控(地址栏参数有group=true&groupId=121232)时`action`会被自动指定为 `appGroupSend`，不需要额外的设置，和单独控制调用完全一样。

### 接收数据

调用 `Hekr.on` 方法来监听命令，传入上报帧的命令名称和回调函数，SDK 接收到数据后，会自动根据协议类型进行解码并触发回调函数。通常来说，开发者只需要接收上报帧，但也可以监听下发帧来满足某些特殊情况。

``` js
$Hekr.on('reportDev', data => {
  console.log(data)
})
```

SDK 也提供与 `on` 方法对应的，同属事件系统的 `off`、`once` 和 `emit` 方法。

``` js
// 监听单次事件
$Hekr.once('reportDev', data => {
  console.log(data)
})

// 移除所有事件
$Hekr.off()
// 移除某一事件
$Hekr.off('reportDev')
// 移除某一事件下的某一回调函数
$Hekr.off('reportDev', fn)

// 主动触发事件
$Hekr.emit('reportDev', data)
```

## 自定义查询帧

查询帧是一种特殊的下发帧。通常情况下，需要每隔 30 秒查询一次。SDK 预设了一种没有其他参数、且每 30 秒发送一次的查询帧。此外，开发者可对查询帧进行自定义，满足不同项目的需求。

``` js
// 默认查询帧格式
{ cmdId: 0 }

// 自定义查询帧
new Hekr({
  query: {
    frame: {
      cmdId: 0
    },
    duration: 30,
    auto: true,
    timeService: [],
    fn: frame => frame
  }
})
```

### 自定义参数

* frame

查询帧格式，当查询帧不为 `{ cmdId: 0 }` 时修改此参数。

* duration

查询周期，当查询帧不为每30秒发送时修改此参数。

* auto

是否自动查询，当项目不需要自动查询或只需手动发送一帧时修改此参数。

* timeService

授时查询，当项目需要在查询帧中带上授时时修改此参数，可选时间参数有 `year`, `month`, `week`, `day`, `hour`, `minute`。

* fn

查询帧函数，当授时查询不能满足项目需求或其他情况时，在此参数中传入一个函数，在查询发送前进行最后的修改操作。


## 自定义编解码函数

对于协议类型为 `JSON透传协议不校验raw` 的项目，需要开发者自行编写自定义的编解码函数，请先阅读理解 [串口透传协议](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE/%E4%B8%B2%E5%8F%A3%E9%80%8F%E4%BC%A0%E5%8D%8F%E8%AE%AE/)。

``` js
// 默认函数
new Hekr({
  decode: raw => raw,
  encode: data => data.raw
})
```

自定义编解码时，只需关注产品业务数据部分，数据头和数据尾会由 SDK 自动补全。例如：

### 自定义解码

函数中的参数 `raw` 为帧格式中的产品业务数据部分，并非完整的帧。

``` js
// 如果接收的数据为 '48070101010052'
// Hekr 会预先截取产品业务数据部分，即 '0100'
function decode (raw) {
  // raw 为　'0100'
  // ...
  // 最后应该返回 { cmdTag: 'reportDev', cmdId: 1, sw: 0 }
  return decoded
}
```

### 自定义编码

函数中的参数 `data` 为调用 `Hekr.send` 时所传的数据，且只需要返回帧格式中的产品业务数据部分，并非完整的帧。

``` js
// 如果发送的数据为 { cmdId: 2, sw: 1 }　
function encode (data) {
  // ...
  // 最后应该返回 '0201'
  return encoded
}
// Hekr 会补全数据头和数据尾后再发送，即 '48070201020155'
```

## 协议模板

在丛云 App 中开发具有局域网功能的控制页面时，需要从本地将协议模板打包到项目中，建议使用 `hekr-cli` 快速获取协议模板。

``` js
const protocol = require('./path/to/protocol.json')

new Hekr({
  protocol
})
```

## openPage函数

调用打开app原生页面
```js
$Hekr.openPage(page?: string, params?: object)

// 直接调用不传参数时打开设备详情
$Hekr.openPage()
```
支持参数组合
| page | params |
| --- | --- |
| device | { divTid: '', ctrlKey: ''} |


## ready函数

SDK 提供一个 `ready` 方法，用于在完成准备阶段，获取到所有必需参数后，触发回调函数。开发者在页面加载完毕时进行的接口请求等操作，需要在这个回调函数里执行。此外，在没有提供回调函数的情况下返回 `Promise`。

``` js
$Hekr.ready(() => {
  // ...
}).catch(err => {
  // ...
})

// 或

$Hekr.ready()
  .then(() => {
    // ...
  })
  .catch(err => {
    // ...
  })
```

## URL 参数查询

SDK 提供了 `query` 方法，满足开发者在页面的 `URL` 中快速进行参数查询，与客户端进行某些联动。

``` js
// http://localhost.com?q=1&w=2&e=3

$Hekr.query('q') // { q: 1 }

$Hekr.query('q', 'w') // { q: 1, w: 2 }

$Hekr.query() // { q: 1, w: 2, e: 3 }
```

## 云端 API<a name="yunduanAPI"></a>

SDK 对一些常用的云端接口请求进行了封装，并提供了相应的格式化方法，方便开发者调用。

### 定时预约

[预约任务](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI/%E5%AE%9A%E6%97%B6%E9%A2%84%E7%BA%A6/) 通常用于某些设备的定时触发任务，有单次预约和循环预约两种方式。

#### 查询预约

``` js
$Hekr.fetch.schedulerTask.get()
  .then(res => {
    const tasks = $Hekr.fetch.schedulerTask.format(res)
    // ...
  })
```

#### 添加或编辑预约

当传入的任务对象中没有 `taskId` 字段时，为添加预约任务，否则为编辑预约任务。

``` js
// 添加单次预约
$Hekr.fetch.schedulerTask.set({
  taskName: '未命名',   // 默认任务名称为 '未命名'
  desc: '备注',         // 默认任务描述为 '备注'
  code: {              // 任务触发代码，必传
    cmdTag: 'queryDev'
  },
  date: new Date(),     // 任务触发时间，为 Date 对象，必传
  data: {               // 或一个有 'hour'、'minute'、'second' 的对象
    hour: 12,
    minute: 0
  },
  enable: true          // 任务是否启用，默认为启动
})
  .then(res => {
    const tasks = $Hekr.fetch.schedulerTask.format(res)
    // ...
  })

//　编辑循环预约
$Hekr.fetch.schedulerTask.set({
  taskId: null,         // 当有该字段时为编辑预约任务
  code: {        
    cmdTag: 'queryDev'
  },
  data: {               // 当有 'repeatList' 字段时为循环预约任务
    hour: 12,
    minute: 0,
    repeatList: ['MON', 'TUE', 'WES', 'THU', 'FRI', 'SAT', 'SUN']
  }
})
  .then(res => {
    const tasks = $Hekr.fetch.schedulerTask.format(res)
    // ...
  })

```

#### 删除预约

删除预约任务时，可直接传入预约任务对象，当参数为空时会删除所有预约任务。

``` js
$Hekr.fetch.schedulerTask.del(task)
  .then(res => {
    const tasks = $Hekr.fetch.schedulerTask.format(res)
    // ...
  })
```

#### 获取最近将要触发的预约
``` js
// next为null表示没有能够触发的预约
// 如存在next为：{hour: ,minte: , secend: ,next: {}}
const next = $Hekr.fetch.schedulerTask.next(task)
```

### 设备快照

[设备快照](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI%E6%80%BB%E8%A7%88/#4116) 通常用于获取设备状态，优先于设备上报帧，在页面上展示设备状态。

``` js
$Hekr.fetch.snapshot.get()
  .then(res => {
    const snapshot = $Hekr.fetch.snapshot.format(res)
    // ...
  })
```

### 统计数据

[统计数据](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI%E6%80%BB%E8%A7%88/#4511) 通常用于图表数据展示，有 `hourly`、`daily`、`weekly`、`monthly`、`yearly` 五种频率。

``` js
$Hekr.fetch.statistics.get(
  frequency: string, // hourly、daily、weekly、monthly、yearly
  tag: string | string[], // 数据参数名称（协议里面对应的字段名称），可以用数组形式传参，如：lightness或[lightness]
)

$Hekr.fetch.statistics.format(
  data: [], // 云端返回统计原始数据
  frequency: string, // hourly、daily、weekly、monthly、yearly
  tag: string | string[], // 数据参数名称（协议里面对应的字段名称），可以用数组形式传参，如：lightness或[lightness]
  xStep?: number // x轴分度值
)
// 获取一天内 'lightness' 的统计数据
$Hekr.fetch.statistics.get('daily', 'lightness')
  .then(res => {
    const statistics = $Hekr.fetch.statistics.format(res, 'daily', 'lightness')
    // ...
  })

// 获取一月内每 5 天的 'lightness' 和 'humidity' 的统计数据
$Hekr.fetch.statistics.get('monthly', ['lightness', 'humidity'])
  .then(res => {
    const statistics = $Hekr.fetch.statistics.format(res, 'monthly', 5)
    // ...
  })
```

### 告警日志

[告警日志](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI/%E7%94%A8%E6%88%B7%E9%80%9A%E7%9F%A5/) 属于 'WARNING' 级别的用户通知，通常用于展示设备的告警记录。

``` js
const page = 0 // page 默认为 0
const size = 20 // size 默认为 20

// 获取第一页的 20 条告警日志
$Hekr.fetch.warnings.get(page, size)
  .then(res => {
    const warnings = $Hekr.fetch.warnings.format(res)
    // ...
  })
```

### 设备偏好

[设备偏好](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI%E6%80%BB%E8%A7%88/#457) 通常用于存储用户的配置等数据，需要先在 [console](https://console.hekr.me) 中提前定义好字段名。

#### 获取设备偏好

``` js
$Hekr.fetch.preferences.get()
  .then(res => {
    const preferences = $Hekr.fetch.preferences.format(res)
    // ...
  })
```

#### 设置设备偏好

``` js
$Hekr.fetch.preferences.set(preferences)
  .then(res => {
    const preferences = $Hekr.fetch.preferences.format(res)
    // ...
  })
```

### 天气实况

[天气实况](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI%E6%80%BB%E8%A7%88/#461) 通常用于获取设备所在城市的室外温湿度等参数。

``` js
if ($Hekr.device.gis) {
  // 获取设备所在城市
  const location = $Hekr.device.gis.ip.city

  // 获取设备当地的天气实况, 参数 lang, unit 非必传
  $Hekr.fetch.weather.get(location, 'zh-Hans', 'c')
    .then(res => {
      const weather = $Hekr.fetch.weather.format(res)
      // ...
    })
}
```

### 授权管理

[反向授权创建](http://docs.hekr.me/v4/%E5%BC%80%E5%8F%91%E6%96%87%E6%A1%A3/%E4%BA%91%E7%AB%AFAPI%E6%80%BB%E8%A7%88/#432) 通常用于创建二维码，供用户进行授权分享。

``` js
// 参数 expire 为有效时间，非必传
$Hekr.fetch.QRCode.get(86400)
  .then(res => {
    const code = $Hekr.fetch.QRCode.format(res)
    // ...
  })
```
