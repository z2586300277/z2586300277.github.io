---
title: "cesium大量面线 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `setFaceCollection`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,cesium大量面线"
outline: deep
---

# cesium大量面线

*Face & Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multFaceLine)


![cesium大量面线](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multFaceLine.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `setFaceCollection`。

> 基础功能 · Cesium.js

## 独立函数

- `setFaceCollection()` — 经纬高 ↔ Cartesian3

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

setFaceCollection(viewer, (faceCollection, lineCollection) => {

    for (var i = 0; i < 10000; i++) {

        var longitude = Math.random() * 360 - 180;

        var latitude = Math.random() * 180 - 90;

        var positions = [longitude, latitude, longitude + Math.random(), latitude, longitude, latitude + Math.random()];

        faceCollection.add({ positions, color: i % 2 == 0 ? 'red' : 'green', id: 'face' + i, opacity: 1 })

        lineCollection.add({ positions, color: '#fff', id: 'line' + i, width: 1.0, opacity: 0.5 })

    }

})

// 创建大量面和线段
function setFaceCollection(viewer, callback) {

    const lineCollection = {

        instances: [],

        add({ positions, color = '#fff', id = '', width = 1.0, opacity = 1 }) {

            if (!positions) return

            this.instances.push(new Cesium.GeometryInstance({

                geometry: new Cesium.PolylineGeometry({

                    posi
```

