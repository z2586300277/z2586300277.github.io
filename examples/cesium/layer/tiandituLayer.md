---
title: "天地图 - Cesium.js 案例讲解"
description: "Cesium 在线底图图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,天地图"
outline: deep
---

# 天地图

*Tianditu Layer*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=tiandituLayer)


![天地图](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/tiandituLayer.jpg)


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

    skyBox: new Cesium.SkyBox({ show: false }),

    requestRenderMode: true, // 是否开启请求渲染模式

})

viewer.scene.sun.show = false

viewer.scene.moon.show = false

viewer.scene.skyBox.show = false

viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0)

viewer._cesiumWidget._creditContainer.style.display = "none"

// 天地图影像图层
viewer.imageryLayers.addImageryProvider(

    new Cesium.WebMapTileServiceImageryProvider({

        url: "https://t0.tianditu.gov.cn/img_w/wmts?tk=c4e3a9d54b4a79e885fff9da0fca712a&service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",

        layer: "tdtImgBasicLayer",

        style: "default",

        format: "image/jp
```

