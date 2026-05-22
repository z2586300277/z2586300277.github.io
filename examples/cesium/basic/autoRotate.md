---
title: "自动旋转 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,自动旋转"
outline: deep
---

# 自动旋转

*Auto Rotate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=autoRotate)


![自动旋转](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。

> 基础功能 · Cesium.js

## 实现思路

- `viewer.clock.onTick` 做逐帧逻辑：改 heading、刷新采样区间、或判断 `JulianDate.compare` 是否到终点后循环。

## 源码

```js
import * as Cesium from 'cesium'

const DOM = document.getElementById('box')

const viewer = new Cesium.Viewer(DOM, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

viewer._cesiumWidget._creditContainer.style.display = "none"

// 动画
viewer.clock.onTick.addEventListener(() => {

    // 可在此处动态添加 条件判断 以控制是否自动旋转

    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.01)

})
```

