---
title: "雷达扫描 - Cesium.js 案例讲解"
description: "地表某点起雷达扫描：半透明椭球标范围，wall 扇面随 heading 旋转。入口在 `RadarSolidScan`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,雷达扫描,单一效果"
outline: deep
---

# 雷达扫描

*Radar Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=radar)


![雷达扫描](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/radar.jpg)


## 效果说明

地表某点起雷达扫描：半透明椭球标范围，wall 扇面随 heading 旋转。入口在 `RadarSolidScan`。

> 单一效果 · Cesium.js

## 实现思路

**扫描扇面**：`CallbackProperty` 每帧读 `positionArr`；`onTick` 里 `heading += 1`，`calcPoints` 用 ENU 矩阵算扇形远端点，再 `computeCirclularFlight` 插成墙顶点。

**范围半球**：`ellipsoid.radii` 三轴同长 = 球半径；`maximumCone: 90°` 只显示上半球，半透明 cyan 与 wall 同色。

## 代码结构

- RadarSolidScan 类实现
- 使用示例

## 类与方法

### RadarSolidScan

- `constructor()` — 参数：options
- `addEntities()` — 往 viewer.entities 挂 wall/ellipsoid 等实体
- `addPostRender()` — 注册 clock.onTick 或 postRender 回调
- `calcPoints()` — 根据 heading/半径算扇面顶点经纬高数组
- `computeCirclularFlight()` — 把扫描线端点转成墙用的 degrees+height 数组
- `clear()` — 移除 Entity / 解绑监听
- `destroy()`
- `stop()`
- `start()`
- `hide()`
- `show()`

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl(
            'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
        )
    ),
    fullscreenButton: false,
    timeline: false,
    infoBox: false
})
```

### RadarSolidScan 类实现

```js
class RadarSolidScan {
    constructor(options) {
        this.viewer = options.viewer
        this.id = options.id || 'radar'
        this.position = Cesium.Cartesian3.fromDegrees(...options.position, 0)
        this.longitude = options.position[0]
        this.latitude = options.position[1]
        this.shortwaveRange = options.shortwaveRange || 50000
        this.positionArr = []
        this.heading = 0
        this.tickListener = null
        this.addEntities()
        this.addPostRender()
    }

    addEntities() {
        this.entity = this.viewer.entities.add({
            id: this.id,
            position: this.position,
            wall: {
                positions: new Cesium.CallbackProperty(() => {
                    return Cesium.Cartesian3.fromDegreesArrayHeights(this.positionArr)
                }, false),
                material: Cesium.Color.fromCssColorString("#00dcff82"),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10.5e6)
            },
            ellipsoid: {
                radii: new Cesium.Cartesian3(
                    this.shortwaveRange,
                    this.shortwaveRange,
                    this.shortwaveRange
                ),
                maximumCone: Cesium.Math.toRadians(90),
                material: Cesium.Color.fromCssColorString("#00dcff82"),
             
```

### 使用示例

```js
const radar = new RadarSolidScan({
    viewer: viewer,
    id: 'radar1',
    position: [120, 36],
    shortwaveRange: 50000 // 50公里
})

viewer.flyTo(radar.entity)
```

