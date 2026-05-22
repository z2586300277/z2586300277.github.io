---
title: "坐标参考 - Cesium.js 案例讲解"
description: "本案例展示 **坐标参考 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,layer,坐标参考"
outline: deep
---
# 坐标参考

*Coordinate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=coordLayer)

![坐标参考](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/coord.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

本案例展示 **坐标参考 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。

> 在线地图 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: false, // 不显示默认图层

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})
 
// 添加瓦片坐标信息
viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider());
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=coordLayer) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [在线地图目录](/examples/cesium/layer/)

> 在线地图 · Cesium.js
