---
title: "绘制文字 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `add`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,绘制文字"
outline: deep
---

# 绘制文字

*Draw Text*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cesiumText)


![绘制文字](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `add`。

> 基础功能 · Cesium.js

## 独立函数

- `add()` — 经纬高 ↔ Cartesian3

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

// 深度监测
viewer.scene.globe.depthTestAgainstTerrain = true;

var text = viewer.entities.add({
    name: '贴地',
    position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
    point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,

    },
    label: {
        text: '贴地',
        font: '14pt monospace',
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        showBackground: true,
        backgroundColor: Cesium.Color.WHITE
    }
});

var world = viewer.entities.add({
    name: '不贴地',
    position:
```

