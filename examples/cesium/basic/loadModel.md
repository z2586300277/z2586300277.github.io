---
title: "加载模型 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `adjust3dtilesPosition`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,加载模型"
outline: deep
---

# 加载模型

*Load Model*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=loadModel)


![加载模型](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/loadModel.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `adjust3dtilesPosition`。

> 基础功能 · Cesium.js

## 实现思路

- Entity.model 加载 glTF/glb，`minimumPixelSize` 保证远距离仍可见。

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

## 独立函数

- `adjust3dtilesPosition()` — 经纬高 ↔ Cartesian3

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

// 3dtiles 模型
const tileset = await Cesium.Cesium3DTileset.fromUrl(FILE_HOST + '3dtiles/test/tileset.json')

viewer.scene.primitives.add(tileset)

adjust3dtilesPosition(tileset)

// 设置视角
viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0))

// gltf 模型 放到 3dtiles 模型中心
viewer.entities.add({

    name: 'gltf',

    position: tileset.boundingSphere.center,

    model: {

        uri: HOST + '/files/model/car.glb',

        minimumPixelSize: 128,

        maximumScale: 200,

    }

})

// 贴地
function adjust3dtilesPosition(tileset) {

    const boundingSphere = tileset.boundingSphere

    const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center) // 获取中心点

    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0) // 获取表面点

    const offset = Cesium.Cartesian3.subtract(surface, boundingSphere.center, new
```

