---
title: "路线导航 - Cesium.js 案例讲解"
description: "Cesium 多技术组合的应用 demo。主流程在 `setProperty`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,路线导航,应用相关"
outline: deep
---

# 路线导航

*Route Nav*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=routeNavigation)


![路线导航](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/routeNavigation.jpg)


## 效果说明

Cesium 多技术组合的应用 demo。主流程在 `setProperty`。

> 应用相关 · Cesium.js

## 实现思路

- 运动轨迹走 `SampledPositionProperty`，把 `(JulianDate, Cartesian3)` 成对写进去；配合 `VelocityOrientationProperty` 机头/模型朝向速度方向。

- `viewer.clock.onTick` 做逐帧逻辑：改 heading、刷新采样区间、或判断 `JulianDate.compare` 是否到终点后循环。

- Entity.polyline 传 `Cartesian3[]` 或 CallbackProperty，`width` + 自定义 MaterialProperty 做流动线/发光线。

- Entity.model 加载 glTF/glb，`minimumPixelSize` 保证远距离仍可见。

## 独立函数

- `setProperty()` — 把 curvePoints 按 speedFactor 写入 position 采样

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: false, // 不显示默认图层

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

const layer = Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl()))

viewer.imageryLayers.add(layer)

const list = [
    {
        "longitude": 116.3877535895933,
        "latitude": 39.917986883763334,
        "height": 5
    },
    {
        "longitude": 116.3879258383737,
        "latitude": 39.91794008705796,
        "height": 5
    },
    {
        "longitude": 116.38861928968578,
        "latitude": 39.91781284391525,
        "height": 5
    },
    {
        "longitude": 116.38869191428421,
        "latitude": 39.91818495388228,
        "height": 5
    }
]

const cartesianPoints = list.map(item => {
    const { longitude, latitude, height } = item
    return Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
})

// CatmullRomSpline 插值
const catmullRomSpline = new Cesium.CatmullRomSpline({
    points: cartesianPoints,
    times: cartesianPoints.map((_, index) => index / (cartesianPoints.length - 1))
})

const numPoints = 1000 // 插值点数量
const interpolatedPoints = []
for (let i 
```

