---
title: "OGC- wms服务 - Cesium.js 案例讲解"
description: "Cesium 在线底图图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,影像"
outline: deep
---

# OGC- wms服务

*OGC- WMS*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=wms)


![OGC- wms服务](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/wms.jpg)


## 效果说明

Cesium 在线底图图层。

> 在线地图 · Cesium.js

## 实现思路

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
    imageryProvider: false,
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式
    sceneModePicker: false,
    navigationHelpButton: false,
    selectionIndicator: false,
    timeline: false,
    infoBox: false,
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源  
    orderIndependentTranslucency: false,
    contextOptions: { webgl: { alpha: true } },
    skyBox: new Cesium.SkyBox({ show: false })
})

// 加载wms
let wms = new Cesium.WebMapServiceImageryProvider({
    url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?",
    layers: "nexrad-n0r",
    credit: "demo",
    parameters: {
        transparent: "true",
        format: "image/png",
    },
})
viewer.imageryLayers.addImageryProvider(wms)
```

