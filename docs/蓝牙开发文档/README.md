# 蓝牙文档

> 蓝牙SDK文档，基于APP提供API二次封装。APP蓝牙桥接接口参见[APP蓝牙桥接接口文档](./APP蓝牙桥接接口文档.md)

## 安装

```bash
npm i @hekr/bluetooth --registry http://npm.hekr.me/
```

## 使用示例

```js
import Bluetooth from '@hekr/bluetooth'

const bl = new Bluetooth()

// 判断蓝牙是否可用
bl.isAvailable()
  .then(available => {
    console.log(available)
  })
  .catch(error => {
    console.error(error)
  })

// 扫描周边蓝牙
bl.discover({ services: ['0000fee0-0000-1000-8000-00805f9b34fb'] })

// 监听discover事件
bl.on('discover', device => {
  console.log(device)
})
```

## 方法

### bl.isAvailable

`bl.isAvailable()`获取蓝牙是否可用，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`，并且返回`true`或`false`，表示是否可用

### bl.isDiscovering

`bl.isDiscovering()`获取蓝牙是否正在扫描中，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`，并且返回`true`或`false`，表示是否正在扫描

### bl.discover

`bl.discover({ services })`扫描周边的蓝牙设备，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`，发现的设备要在`discover`事件中去获取

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| services | string[] | - | 否 | 要搜索的蓝牙设备主 service 的 uuid 列表。某些蓝牙设备会广播自己的主 service 的 uuid。如果设置此参数，则只搜索广播包有对应 uuid 的主服务的蓝牙设备。建议主要通过该参数过滤掉周边不需要处理的其他蓝牙设备。|

### bl.stopDiscover

`bl.stopDiscover()`停止扫描，返回 Promise，建议在设备连接后调用`stopDiscover`，因为`discover`占用资源较多

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`

### bl.connect

`bl.connect({ deviceId })`连接指定设备，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`，设备连接状态需要到`connect`事件中去获取

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| deviceId | string | - | 是 | 设备 id |

### bl.disconnect

`bl.disconnect({ deviceId })`断开指定设备，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`，设备连接状态需要到`connect`事件中去获取

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| deviceId | string | - | 是 | 设备 id |

### bl.getServices

`bl.getServices({ deviceId })`获取指定`deviceId`设备下的所有服务(`serviceId`)，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`，并且返回`serviceId`列表

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| deviceId | string | - | 是 | 设备 id |

### bl.getCharacteristics

`bl.getCharacteristics({ deviceId, serviceId })`获取指定`deviceId`和`serviceId`下的特征值(`characteristicId`)，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`，并且返回`characteristicId`列表

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| deviceId | string | - | 是 | 设备 id |
| serviceId | string | - | 是 | 蓝牙服务 uuid, 需要使用 getServices 获取 |

### bl.notify

`bl.notify({ deviceId, serviceId, characteristicId })`启用低功耗蓝牙设备特征值变化时的 notify 功能，只有启用本功能订阅的 `notify` 事件才会被触发，返回Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| deviceId | string | - | 是 | 设备 id |
| serviceId | string | - | 是 | 蓝牙服务 uuid |
| characteristicId | string | 是 | 蓝牙特征值的 uuid |

### bl.read

`bl.read({ deviceId, serviceId, characteristicId })`读取特征值中的二进制数据，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`, 数值要在`notify`事件中去读取

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| deviceId | string | - | 是 | 设备 id |
| serviceId | string | - | 是 | 蓝牙服务 uuid |
| characteristicId | string | 是 | 蓝牙特征值的 uuid |

### bl.write

`bl.write({ deviceId, serviceId, characteristicId, value })`写入特征值二进制数据，返回 Promise

- API 调用失败 Promise 状态变为`rejected`
- API 调用成功 Promise 状态变为`resolved`, 数值要在`notify`事件中去读取

#### 参数

| 参数名称 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| deviceId | string | - | 是 | 设备 id |
| serviceId | string | - | 是 | 蓝牙服务 uuid |
| characteristicId | string | 是 | 蓝牙特征值的 uuid |
| value | ArrayBuffer | - | 是 | 蓝牙设备特征值对应的二进制值 |

## 事件

### available

蓝牙可用性状态改变事件，回调中返回`true`或`false`

### discover

蓝牙扫描发现新设备是触发本事件，回调中返回设备信息

### connect

蓝牙连接状态改变事件，回调中返回`deviceId`和`connected`(连接状态)

### notify

监听蓝牙设备的特征值变化事件，回调中返回对应的特征值对象，特征值以`ArrayBuffer`的形势返回
