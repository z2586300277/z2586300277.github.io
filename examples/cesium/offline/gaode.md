---
title: "内网高德 - Cesium.js 案例讲解"
description: "Cesium 离线/内网影像。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,内网高德"
outline: deep
---

# 内网高德

*Intranet Gaode*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=gaode)


![内网高德](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/offline/gaode.jpg)


## 效果说明

Cesium 离线/内网影像。

> 离线地图 · Cesium.js

## 实现思路

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

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

