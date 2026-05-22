---
title: "cesium大量点 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `color`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,cesium大量点"
outline: deep
---

# cesium大量点

*Multiple Points*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multPoint)


![cesium大量点](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multPoint.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `color`。

> 基础功能 · Cesium.js

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

// 设置一个视角
viewer.camera.setView({

    destination: Cesium.Cartesian3.fromRadians(2.100117282185777, 0.6195146302793972, 104244.23864046125),

    orientation: {

        direction: new Cesium.Cartesian3(0.5153454276260272, -0.7794098602398831, 0.3562855034741005),

        up: new Cesium.Cartesian3(-0.1511548595883593, 0.326557215595639, 0.9330126437327882)

    }

})

// 添加点击事件监听器
viewer.screenSpaceEventHandler.setInputAction(function (event) {

    const object = viewer.scene.pick(event.position)

    console.log(object.id)

}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

const billboards = new Cesium.BillboardCollection(); //  创建billboard集合对象

viewer.scene.primitives.add(billboards); //  添加billboard集合对象到场景中

const color = () => new Cesium.Color(Math.random(), Math.random(), Math.random(), 1); // 随机颜色

//  生成64800个点，每个经度、纬度值各生成一个点，高度为0（贴地表）
for (var longitude = -180; longitude < 180; longitude++) {

    for (v
```

