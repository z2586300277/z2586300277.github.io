---
title: "曲线漫游 - Cesium.js 案例讲解"
description: "Cesium 多技术组合的应用 demo。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,曲线漫游,应用相关"
outline: deep
---

# 曲线漫游

*Curve Roam*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=cameraCurveRoam)


![曲线漫游](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/cameraCurveRoam.jpg)


## 效果说明

Cesium 多技术组合的应用 demo。主流程在 `animate`。

> 应用相关 · Cesium.js

## 实现思路

- Entity.polyline 传 `Cartesian3[]` 或 CallbackProperty，`width` + 自定义 MaterialProperty 做流动线/发光线。

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as Cesium from 'cesium'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(

        Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())
        
    ),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

const tileset = await Cesium.Cesium3DTileset.fromUrl(FILE_HOST + '3dtiles/house/tileset.json')

viewer.scene.primitives.add(tileset)

viewer.flyTo(tileset);

// 经纬度 高度
const list = [
    [121.47857119758791, 29.79125471709178, 16.455626729366145],
    [121.47888991686754, 29.79121144438129, 16.43945469952735],
    [121.4793563626501, 29.79115700403782, 16.500224202937577],
    [121.47959615722343, 29.791255451852457, 19.638183861734586],
    [121.4799150177678, 29.791206202923174, 19.709391069654206],
    [121.48017710101357, 29.791136574675704, 19.707021008968702],
    [121.48024839194412, 29.791355774130647, 16.498928502606283],
    [121.47938339181717, 29.791564467242317, 17.821189061225503],
    [121.4788135287918, 29.79168578787095, 19.667240655082814],
    [121.47901177358922, 29.791479635806983, 19.655729311572056]
]

const cartesianPoints = list.map(item => Cesium.Cartesian3.fromDegrees(item[0], item[1], 
```

