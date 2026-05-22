---
title: "css2D元素 - Cesium.js 案例讲解"
description: "本案例展示 **css2D元素 ** 的实现。涉及：Cesium Viewer 初始化、Cesium Entity 高层 API、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,css2D元素"
outline: deep
---
# css2D元素

*CSS2D Element*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cssElement)

![css2D元素](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/cssElement.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium Entity 高层 API
- Cesium 影像图层

## 效果说明

本案例展示 **css2D元素 ** 的实现。涉及：Cesium Viewer 初始化、Cesium Entity 高层 API、Cesium 影像图层。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **Entity** 加点线面、模型、标签；适合业务对象与交互。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`setCss2dDom()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

// 创建一个专门用于放置2dDOM的容器
const css2dContainer = document.createElement('div')

Object.assign(css2dContainer.style, {

    position: 'absolute',

    top: '0',

    left: '0',

    pointerEvents: 'none',

    zIndex: '1',

})

box.appendChild(css2dContainer)

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: false, // 不显示默认图层

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

const url = GLOBAL_CONFIG.getLayerUrl()

const layer = Cesium.ImageryLayer.fromProviderAsync(

    Cesium.ArcGisMapServerImageryProvider.fromUrl(url)

)

viewer.imageryLayers.add(layer)

// 创建2dDOM
const DOM = document.createElement('div')

// 样式 
Object.assign(DOM.style, {

    width: '100px',

    height: '30px',

    border: '1px solid blue',

    color: 'white',

    fontSize: '20px',

    cursor: 'pointer'

})

DOM.innerHTML = '2dDOM'

setCss2dDom(viewer, DOM, [116.46, 39.92, 0]) // 设置2dDOM 移动

viewer.entities.add({ position: Cesium.Cartesian3.fromDegrees(116.46, 39.92), point: { pixelSize: 10 } }) // 创建测试点

viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(116.46, 39.92, 10000000) }) // 定位

/* 设置2dDOM 移动 */
function setCss2dDom(viewer, DOM, position) {

    if (!position) return

    if (!(position instanceof Cesium.Cartesian3)) position = Cesium.Cartesian3.fromDegrees(...position)

    Object.assign(DOM.style, {

        pointerEvents: 'all',

        zIndex: 'auto',

    })

    const { offsetHeight } = DOM

    const { camera, scene } = viewer

    css2dContainer.appendChild(DOM)

    const destroy = viewer.scene.postRender.addEventListener(() => {

        const windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, position)

        if (windowCoord) {

            DOM.style.transform = `translate(${windowCoord.x}px, ${windowCoord.y - offsetHeight}px)`

        }

        const maxDistance = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height + scene.globe.ellipsoid.maximumRadius

        Cesium.Cartesian3.distance(camera.position, position) > maxDistance ? DOM.style.display = 'none' : DOM.style.display = 'block'

    })

    return () => {

        viewer.css2dContainer.removeChild(DOM)

        destroy()

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cssElement) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
