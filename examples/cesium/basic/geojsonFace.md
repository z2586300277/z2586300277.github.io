---
title: "geojson面 - Cesium.js 案例讲解"
description: "本案例展示 **geojson面 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 鼠标拾取交互、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,geojson面"
outline: deep
---
# geojson面

*GeoJSON Face*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=geojsonFace)

![geojson面](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/geojsonFace.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 鼠标拾取交互
- Cesium 影像图层
- GeoJSON 矢量数据加载

## 效果说明

本案例展示 **geojson面 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 鼠标拾取交互、Cesium 影像图层。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ScreenSpaceEventHandler** 监听点击；`scene.pick` 取 Entity，`pickPosition` 取地表坐标。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

- 加载 GeoJSON 转 Entity 面/线/点，可配 extrudedHeight 做拉伸。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 配置 ScreenSpaceEventHandler 交互
4. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`setGeoPolygon()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

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

// 加载geojson数据
const dataSource = setGeoPolygon(viewer, 'https://z2586300277.github.io/three-editor/dist/files/font/guangdong.json')

// 看向geojson数据
viewer.flyTo(dataSource)

// 点击变色
viewer.screenSpaceEventHandler.setInputAction((event) => {

    const pickedObject = viewer.scene.pick(event.position)

    if (Cesium.defined(pickedObject) && pickedObject.id) {

        pickedObject.id.polygon.material = Cesium.Color.fromCssColorString('yellow').withAlpha(0.5)

    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

// 创建 面
async function setGeoPolygon(viewer, source, params = {}) {

    const dataSource = await Cesium.GeoJsonDataSource.load(source, {

        stroke: Cesium.Color.fromCssColorString(params.strokeColor || 'red').withAlpha(params.strokeOpacity || 0.5), // 边界

        fill: Cesium.Color.fromCssColorString(params.fillColor || 'blue').withAlpha(params.fillOpacity || 0.5), // 填充

        strokeWidth: params.strokeWidth || 3,

        markerSymbol: '?',

        ...params

    })

    dataSource.changeMaterial = (params) => dataSource.entities.values.forEach(entity => {

        entity.polygon.material = Cesium.Color.fromCssColorString(params.fillColor || 'blue').withAlpha(params.fillOpacity || 0.5)

        entity.polygon.outlineColor = Cesium.Color.fromCssColorString(params.strokeColor || 'red').withAlpha(params.strokeOpacity || 0.5)

        entity.polygon.outlineWidth = params.strokeWidth || 3

    })

    viewer.dataSources.add(dataSource)

    return dataSource

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=geojsonFace) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
