---
title: "cesium大量点 - Cesium.js 案例讲解"
description: "本案例展示 **cesium大量点 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 鼠标拾取交互、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,cesium大量点"
outline: deep
---
# cesium大量点

*Multiple Points*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multPoint)

![cesium大量点](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multPoint.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 鼠标拾取交互
- Cesium 影像图层

## 效果说明

本案例展示 **cesium大量点 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 鼠标拾取交互、Cesium 影像图层。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

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

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

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

    for (var latitude = -90; latitude < 90; latitude++) {

        billboards.add({

            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),

            image: HOST + '/files/author/z2586300277.png', // 图标

            scale: 0.1, // 调整图标的大小

            color: color(), // 随机颜色

            id: 'billboard' + '-' + longitude + '-' + latitude

        })

    }

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multPoint) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
