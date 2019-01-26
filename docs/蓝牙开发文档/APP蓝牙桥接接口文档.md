# APP蓝牙桥接接口文档

## 方法

### bl.isAvailable

`bl.isAvailable()`获取蓝牙是否可用，返回`true`或`false`

### bl.isDiscovering

`bl.isDiscovering()`获取蓝牙是否正在扫描中，返回`true`或`false`

### bl.discover

`bl.discover({ services, success, fail })`扫描周边的蓝牙设备`services`为数组，表示要搜索但蓝牙设备主`service`的`uuid`列表

### bl.stopDiscover

`bl.stopDiscover({ success, fail })`停止扫描

### bl.connect

`bl.connect({ deviceId, success, fail })`连接指定设备，`deviceId`表示要连接的设备的 id

### bl.disconnect

`bl.disconnect({ deviceId, success, fail })`断开指定设备，`deviceId`表示要断开的设备的 id

### bl.getServices

`bl.getServices({ deviceId, success, fail })`，发现指定`deviceId`下的所有服务`serviceId`，success 会回调获得到的 serviceId 列表

### bl.getCharacteristics

`bl.getCharacteristics({ deviceId, serviceId, success, fail })`，发现指定 deviceId 和 serviceId 下的特征值，success 会回调获得的特征值列表

### bl.notify

`bl.notify({ deviceId, serviceId, characteristicId, success, fail })`启用低功耗蓝牙设备特征值变化时的 notify 功能，即启用 notify 事件

### bl.read

`bl.read({ deviceId, serviceId, characteristicId, success, fail })`读取特征值中的二进制数据，数值要在 notify 事件中去读取

### bl.write

`bl.write({ deviceId, serviceId, characteristicId, value, success, fail })`写入特征值二进制数据，如果数值变化要在 notify 中去读取

**注意：** `success, fail`: 表示 api 调用成功失败的回调，成功时会调用 success，失败时调用 fail

## 事件

### BluetoothAvailableChanged

蓝牙可用性变化事件

### BluetoothDidConnect

蓝牙连接事件

### BluetoothDidDisconnect

蓝牙断开连接事件

### BluetoothDidDiscover

扫描到新设备的事件回调

### BluetoothDidNotify

蓝牙特征值改变后的 notify 事件，必须先调用`notify`方法此功能才有效
