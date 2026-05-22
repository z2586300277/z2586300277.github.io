---
title: "cesium大量文字 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `createCanvasText`、`createBorder`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,cesium大量文字"
outline: deep
---

# cesium大量文字

*Multiple Texts*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multText)


![cesium大量文字](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multText.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `createCanvasText`、`createBorder`。

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

viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(116.46, 39.92, 8000000) }) // 设置相机位置

const citys = await fetch('https://z2586300277.github.io/three-editor/dist/files/other/city.json').then(res => res.json()) // 获取城市数据

const updateCanvasText = createCanvasText({ dpr: 1.4 }) // 创建canvas

const billboards = new Cesium.BillboardCollection() // 创建合集

viewer.scene.primitives.add(billboards) // 添加图层

const getColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0') // 随机颜色

for (const key in citys) {

    const [longitude, latitude] = citys[key]

    billboards.add({

        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),

        image: updateCanvasText({ text: key, color: getColor() }),

        scale: 0.5
        
    })
    
}

// 创建canvas文字方法
function createCanvasText(params) {

    const defaultParams = { dpr: 1, maxWidth: 100, fontSize: 20, color: 
```

