---
title: "内网高德 - Cesium.js 案例讲解"
description: "本案例展示 **内网高德 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,offline,内网高德"
outline: deep
---
# 内网高德

*Intranet Gaode*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=gaode)

![内网高德](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/offline/gaode.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

本案例展示 **内网高德 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。

> 离线地图 · Cesium.js

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

// 这里 https://github.com/z2586300277/3d-file-server 是我存放离线地图瓦片资源的仓库 

// 瓦片下载 - 可通过多种方式 例如 望远网 地图资源下载

// 这里我只下载了 3 - 5 级的瓦片    

viewer.imageryLayers.addImageryProvider(

    new Cesium.UrlTemplateImageryProvider({

        url: FILE_HOST + 'map/Gaode/tiles/{z}/{x}/{y}.png',

        maximumLevel: 5,

        minimumLevel: 3,

    })

)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=gaode) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [离线地图目录](/examples/cesium/offline/)

> 离线地图 · Cesium.js
