# virtual

## 网关连接过程

requestVerify -> requestVerifyResp -> gatewayLogin -> gatewayLoginResp -> reportDevInfo -> reportDevInfoResp ->
**?.** 设备已经添加到网关子设备的时候 -> reportSubDevInfo -> 登录结束
**?.** 设备没有被添加到网关子设备的时候 -> addSubDev -> 登录结束


1. ws open发送`requestVerify`帧，帧中包含`device.devTid和device.prodKey`
2. 接收到`requestVerifyResp`
3. 根据`device.devTid`、`subDevice.devpriKey`和`requestVerifyResp`返回的`randomKey`生成md5，并包含在帧`gatewayLogin`的authKey字段中发送出去
4. 接收到`gatewayLoginResp`
5. 拿到帧中的`ctrKey`并赋值给`device.ctrlKey`，并通过API借口查看是否存在`device。devTid`对应的设备，没有就绑定这个设备，然后发送`reportDevInfo`帧
6. 接收到`reportDevInfoResp`帧
7. 如果设备是网关就拉取网关的子设备列表，如果当前子设备存在子设备列表中就发送`reportSubDevInfo`帧，否则发送`addSubDev`帧添加子设备，并发送`getTimerList`帧
8. 发送`reportSubDevInfo`的情况：接收到`reportSubDevInfoResp`帧，然后整个登录过程结束
9. 发送`addSubDev`的情况：接收到`addSubDevResp`帧，然后整个登录过程结束
10. 接收到`getTimerListResp`帧的时候就开始计时发送心跳包`heartbeat`


## 独立设备连接过程

devLogin -> devLoginResp -> reportDevInfo -> reportDevInfoResp -> 登录结束

在接收到reportDevInfo的时候就发送`getTimerList`帧，在接受到`getTimerListResp`时开始发送心跳包`heartbeat`


## 发送的帧和接收的帧

| 发送 | 接收 |
| :--- | :--- |
| devSend | - |
| devLogin | devLoginResp |
| addSubDev | addSubDevResp |
| heartbeat | heartbeatResp |
| timerReport | - |
| devSyncResp | devSync |
| appSendResp | appSend |
| gatewayLogin | gatewayLoginResp |
| getTimerList | getTimerListResp |
| requestVerify | requestVerifyResp |
| reportDevInfo | reportDevInfoResp |
| reportSubDevInfo | reportSubDevInfoResp |

## 项目目录结构

```bash
src
│
│  index.ts # 入口文件
│  state.ts # 虚拟设备内部参数状态
│  utils.ts # 工具函数
│
├─actions # 各种命令action
│  │  index.ts
│  │
│  ├─receive # 虚拟设备接收到的action处理函数
│  │  │  index.ts
│  │  │
│  │  └─actions # 文件名称就是action的名称
│  │          addSubDevResp.ts
│  │          appSend.ts
│  │          devLoginResp.ts
│  │          devSync.ts
│  │          gatewayLoginResp.ts
│  │          getTimerListResp.ts
│  │          heartbeatResp.ts
│  │          index.ts
│  │          reportDevInfoResp.ts
│  │          reportSubDevInfoResp.ts
│  │          requestVerifyResp.ts
│  │
│  └─send # 虚拟设备发送到云端的action
│      │  index.ts
│      │
│      └─actions # 文件名称就是action的名称
│              addSubDev.ts
│              appSendResp.ts
│              devLogin.ts
│              devSend.ts
│              devSyncResp.ts
│              gatewayLogin.ts
│              getTimerList.ts
│              heartbeat.ts
│              index.ts
│              reportDevInfo.ts
│              reportSubDevInfo.ts
│              requestVerify.ts
│              timerReport.ts
│
├─decode # 各种协议解码相关的方法
│      decode.ts
│      index.ts
│      jsonCtrl.ts
│      jsonTransparent.ts
│      jsonTransparentNotCheckRaw.ts
│
├─encode # 各种协议编码相关的方法
│      encode.ts
│      index.ts
│      jsonCtrl.ts
│      jsonTransparent.ts
│      jsonTransparentNotCheckRaw.ts
│
├─fetch # 调用云端API
│      device.ts
│      devPriKey.ts
│      index.ts
│      protocol.ts
│      snapshot.ts
│
└─ws # WebSocket连接
        index.ts
```

## 使用示例[demo](./index.html)

### Browser
```js
// 独立设备
const independent = {
  devTid: '01_ea36eba5dcb422848aaeeba20ef11',
  token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNDI1NTE3Mjc4MSIsInBpZCI6IjAwMDAwMDAwMDAwIiwiZW50IjoiMDE0OTA0NTY2MzQiLCJ0eXBlIjoiV0VCIiwiZXhwIjoxNTE3MzYzMTE1LCJqdGkiOiI3N2MxOWRjYS05ZTkzLTRhNTAtYTRkZC1jMjMyYzkxMTBhNGUiLCJyb2xlcyI6WyJlbnRlcnByaXNlIl19.NpL1G5SlVEnekFoKj1fS9T_WQOwuK1yWGoC6WtT79O-ZA-ioMcrQ4EerTvo3m2EeV0KSFHkvUKjUfdTxofrnYg=='
}

// 网关子设备
const gateway = {
  devTid: '270fd8eadad140a59df6272349838c9f',
  subDevTid: '01_76bbe85247ff2c4152167d3486d52',
  token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNDI1NTE3Mjc4MSIsInBpZCI6IjAwMDAwMDAwMDAwIiwiZW50IjoiMDE0OTA0NTY2MzQiLCJ0eXBlIjoiV0VCIiwiZXhwIjoxNTE3MzYzMTE1LCJqdGkiOiI3N2MxOWRjYS05ZTkzLTRhNTAtYTRkZC1jMjMyYzkxMTBhNGUiLCJyb2xlcyI6WyJlbnRlcnByaXNlIl19.NpL1G5SlVEnekFoKj1fS9T_WQOwuK1yWGoC6WtT79O-ZA-ioMcrQ4EerTvo3m2EeV0KSFHkvUKjUfdTxofrnYg=='
}

const virtual1 = new Virtual(independent)
const virtual2 = new Virtual(gateway)

// 虚拟设备登陆成功后执行
virtual1.ready(() => {
  console.log(virtual1)
})

virtual1.on('receive', data => {
  console.log(data)
})

virtual1.on('send', data => {
  console.log(data)
})
```

### Node
```js
const WebSocket = require('ws')

// 加载到全局，否者会报错
global.WebSocket = WebSocket

// 独立设备
const independent = {
  devTid: '01_ea36eba5dcb422848aaeeba20ef11',
  token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNDI1NTE3Mjc4MSIsInBpZCI6IjAwMDAwMDAwMDAwIiwiZW50IjoiMDE0OTA0NTY2MzQiLCJ0eXBlIjoiV0VCIiwiZXhwIjoxNTE3MzYzMTE1LCJqdGkiOiI3N2MxOWRjYS05ZTkzLTRhNTAtYTRkZC1jMjMyYzkxMTBhNGUiLCJyb2xlcyI6WyJlbnRlcnByaXNlIl19.NpL1G5SlVEnekFoKj1fS9T_WQOwuK1yWGoC6WtT79O-ZA-ioMcrQ4EerTvo3m2EeV0KSFHkvUKjUfdTxofrnYg=='
}

const virtual1 = new Virtual(independent)

// 虚拟设备登陆成功后执行
virtual1.ready(() => {
  console.log(virtual1)
})

virtual1.on('update', (nState, oState) => {
  console.log('update:----------------------------')
  console.log(nState, oState)
  console.log('-----------------------------------')
})

virtual1.on('receive', data => {
  console.log(data)
})

virtual1.on('send', data => {
  console.log(data)
})
```

## Options

网关子设备，devTid为网关的`devTid`，subDevTid为子设备的`devTid`，token是用户调用云端API时用到的token

```js
// 值为不为undefined的都是默认值
new Virtual({
  token: undefined, // 用户token
  devTid: undefined, // 设备devTid
  subDevTid: undefined, // 子设备devTid
  debug: true, // 是否为网页debug模式，否则为预览模式
  heartbeat: 7000, // 心跳间隔
  reconnect: false, // ws断开自动重连
  delay: 0, // 上报帧延时时间，模拟网络延时
  report: false, // 状态改变后是否上报包含参数的上报帧（非关联上报帧）
  URL: {
    console: 'https://console-openapi.hekr.me', // console api地址
    user: 'https://user-openapi.hekr.me', // user api地址
    ws: 'wss://asia-dev.hekr.me:184' // ws地址
  }
})
```

## Methods

| 名称 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| ready | 虚拟设备登录成功后的回调 | 回调函数 | 返回Promise |
| receive | 传入数据，模拟云端发送数据到设备 | 发送的数据 | - |
| send | 发送数据到云端 | 发送的数据 | - |
| setState | 设置内部状态值 | 状态数据对象 | - |
| connect | 建立ws连接 | - | - |
| close | 关闭ws连接 | - | - |

* **ready**：设备登录成功回调，返回Promise
```js
virtual.ready(() => {
  // 设备已经登录成功
  // do something
})
```

* **receive**：传入数据，模拟云端发送数据到设备，无返回值
```js
// data为云端通过ws返回的数据经JSON.parse序列化后的数据
virtual.receive(data)
```

* **send**：发送数据到云端，无返回值
```js
// 可以把data看作是websocket通信中的{params: { data }}中的data部分的数据
const data = {
  cmdId: 1,
  sw: 1,
  light: 100
}
virtual.send('devSend', { data })
```

* **setState**：更新设备状态state，无返回值
```js
// 更新state中的数据
// 更新策略和react的setState是一样的
virtual.setState({ data })
```

* **connect**：建立WebSocket连接，如果已经有可用连接就不再创建新的

* **close**：关闭WebSocket连接，无返回值

## Events

| 名称 | 说明 | 回调参数 |
| --- | --- | --- |
| receive | 接收到云端数据事件 | 接收到的数据 |
| send | 发送到云端数据事件 | 发送的数据 |
| update | state改变更新事件 | nState:最新的状态数据，oState:前一个状态的数据 |
