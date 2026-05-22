---
title: "点击事件 - Cesium.js 案例讲解"
description: "地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,点击事件"
outline: deep
---

# 点击事件

*Click Event*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=clickEvent)


![点击事件](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/clickEvent.jpg)


## 效果说明

地图上的弧形飞线，线条材质贴图沿切线方向滚动；如有 model 则沿测地曲线飞行。

> 基础功能 · Cesium.js

## 实现思路

- Entity.polyline 传 `Cartesian3[]` 或 CallbackProperty，`width` + 自定义 MaterialProperty 做流动线/发光线。

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

- 拾取用 `ScreenSpaceEventHandler` + `scene.pick` / `pickPosition`，注意地形深度。

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

const url = GLOBAL_CONFIG.getLayerUrl()
 
const layer = Cesium.ImageryLayer.fromProviderAsync(

    Cesium.ArcGisMapServerImageryProvider.fromUrl(url)

)

viewer.imageryLayers.add(layer)

// 添加点击事件监听器
viewer.screenSpaceEventHandler.setInputAction(function (event) {

    const object = viewer.scene.pick(event.position)

    const cartesian = viewer.scene.pickPosition(event.position)

    if (Cesium.defined(cartesian)) {

        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)

        const longitude = Cesium.Math.toDegrees(cartographic.longitude)

        const latitude = Cesium.Math.toDegrees(cartographic.latitude)

        const height = cartographic.height

        console.log('经度：', longitude, '纬度：', latitude, '高度：', height)

    }

    if (Cesium.defined(object)) {

        const { id } = object

        alert('点击到的对象：' + id.name + '-----id：'+ id.id)
        
    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

// 视角定位到中国
viewer.camera.flyTo({

    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 10000000)

})

```

