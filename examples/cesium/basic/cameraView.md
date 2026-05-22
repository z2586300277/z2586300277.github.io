---
title: "记录视角 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `loadView`、`cartesian3ToDegrees`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,记录视角,基础功能"
outline: deep
---

# 记录视角

*Camera View*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cameraView)


![记录视角](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `loadView`、`cartesian3ToDegrees`。

> 基础功能 · Cesium.js

## 实现思路

- 局部 ENU → 世界坐标：`Transforms.eastNorthUpToFixedFrame`，雷达/箭头类特效常用。

## 独立函数

- `loadView()` — 经纬高 ↔ Cartesian3

## 源码

```js
import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

const gui = new GUI()

const cartesian3ToDegrees = (cartesian3) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
    return {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height
    }
}

const saveView = () => ({
    positionDegrees: cartesian3ToDegrees(camera.positionWC), // 经纬度坐标
    position: camera.positionWC, // 笛卡尔坐标
    direction: camera.directionWC, // 方向
    up: camera.upWC,  // 上方向
    frustum: {
        fov: camera.frustum.fov, // 视场角
        near: camera.frustum.near, // 近裁剪面距离
        far: camera.frustum.far // 远裁剪面距离
    },
    heading: camera.heading, // 偏航角 只读
    pitch: camera.pitch, // 俯仰角 只读
    roll: camera.roll, // 翻滚角 只读
})

function loadView(view) {
    if (view) {
        Math.random() > 0.5 ? viewer.camera.flyTo({
     
```

