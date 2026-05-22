---
title: "影像 - Cesium.js 案例讲解"
description: "Cesium 离线/内网影像。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,影像"
outline: deep
---

# 影像

*Image Map*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=offline&id=img)


![影像](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/offline/img.jpg)


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

let imagelayer = new Cesium.SingleTileImageryProvider({
    url: FILE_HOST + "images/offlineLayer/world_img.jpg",
    tileWidth: 256,
    tileHeight: 256,
});
viewer.imageryLayers.addImageryProvider(imagelayer);
```

