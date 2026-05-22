---
title: "点击事件 - Cesium.js 案例讲解"
description: "ScreenSpaceEventHandler 鼠标拾取、scene.pick 与 pickPosition 经纬高转换"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,点击事件"
outline: deep
---
# 点击事件

*Click Event*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=clickEvent)

![点击事件](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/clickEvent.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium Entity 高层 API
- Cesium 鼠标拾取交互
- Cesium 影像图层
- Cesium 动态材质属性

## 效果说明

点击地球表面或 Entity 时，控制台输出 **经纬高**，或对 Entity 弹出提示。演示 Cesium 最基础的 **屏幕空间拾取** 流程。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **Entity** 加点线面、模型、标签；适合业务对象与交互。

- **ScreenSpaceEventHandler** 监听点击；`scene.pick` 取 Entity，`pickPosition` 取地表坐标。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 配置 ScreenSpaceEventHandler 交互
4. 按需 `camera.flyTo` 定位视角

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

// 测试点
const point = viewer.entities.add({

    name: '测试点',

    id: '点-id',

    position: Cesium.Cartesian3.fromDegrees(116.39, 39.9),

    point: {

        pixelSize: 10,

        color: Cesium.Color.RED,

        outlineColor: Cesium.Color.WHITE,

        outlineWidth: 2

    }

})

// 测试面
const polygon = viewer.entities.add({

    name: '测试多边形',

    id: '多边形-id',

    polygon: {

        hierarchy: Cesium.Cartesian3.fromDegreesArray([

            90.38, 30.91,

            80.38, 30.89,

            100.4, 39.89,

            105.4, 39.91

        ]),

        material: Cesium.Color.RED.withAlpha(0.5)

    }

})

// 测试线
const polyline = viewer.entities.add({
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=clickEvent) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
