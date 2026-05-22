---
title: "天空盒 - Cesium.js 案例讲解"
description: "本案例展示 **天空盒 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,天空盒"
outline: deep
---
# 天空盒

*Sky Box*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=skyBox)

![天空盒](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/skyBox.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

本案例展示 **天空盒 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。

> 基础功能 · Cesium.js

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
 
viewer.imageryLayers.addImageryProvider(

    new Cesium.UrlTemplateImageryProvider({

        //高德卫星影像
        url: 'https://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',

        maximumLevel: 18

    })

)

// px => -90, nx => 90, py => 0, ny => 180, pz => 0, nz => 180
viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
        positiveX: FILE_HOST + 'files/cesiumSky/px.png', // 右面
        negativeX: FILE_HOST + 'files/cesiumSky/nx.png', // 左面
        positiveY: FILE_HOST + 'files/cesiumSky/pz.png', // 将前面用作上面
        negativeY: FILE_HOST + 'files/cesiumSky/nz.png', // 将后面用作下面
        positiveZ: FILE_HOST + 'files/cesiumSky/py.png', // 将上面用作前面
        negativeZ: FILE_HOST + 'files/cesiumSky/ny.png'  // 将下面用作后面
    }
});
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=skyBox) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
