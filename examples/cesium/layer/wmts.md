---
title: "OGC- wmts服务 - Cesium.js 案例讲解"
description: "Cesium 在线底图图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,影像"
outline: deep
---

# OGC- wmts服务

*OGC- WMTS*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=layer&id=wmts)


![OGC- wmts服务](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/wmts.jpg)


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
    imageryProvider: false,
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

// 加载天地图wmts
var _layer = 'vec';
var token = 'bcc62222fc634ec736589c483de933e6';
var maxLevel = 18;
var matrixIds = new Array(maxLevel);
for (var z = 0; z <= maxLevel; z++) {
    matrixIds[z] = (z + 1).toString();
}
var _url = 'https://t{s}.tianditu.gov.cn/' + _layer + '_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=' + token;
var wmts = new Cesium.WebMapTileServiceImageryProvider({
    url: _url,
    layer: _layer,
    credit: 'opts.credit',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'c',
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
   
```

