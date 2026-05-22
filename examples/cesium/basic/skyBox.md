---
title: "天空盒 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,天空盒,基础功能"
outline: deep
---

# 天空盒

*Sky Box*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=skyBox)


![天空盒](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/skyBox.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。

> 基础功能 · Cesium.js

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

