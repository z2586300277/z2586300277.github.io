---
title: "cesium大量立方体 - Cesium.js 案例讲解"
description: "本案例展示 **cesium大量立方体 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,cesium大量立方体"
outline: deep
---
# cesium大量立方体

*Multiple Cubes*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multBox)

![cesium大量立方体](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multBox.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

本案例展示 **cesium大量立方体 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

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

const instances = [];

for (let i = 0; i < 10000; i++) {

    const longitude = Math.random() * 360 - 180;

    const latitude = Math.random() * 180 - 90;

    const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);

    const dimensions = new Cesium.Cartesian3(40000.0, 30000.0, 500000.0);

    const color = Cesium.Color.RED.withAlpha(0.2);

    instances.push(new Cesium.GeometryInstance({

        geometry: new Cesium.BoxGeometry.fromDimensions({

            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,

            dimensions: dimensions

        }),

        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),

        attributes: {

            color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)

        }

    }));

}

viewer.scene.primitives.add(new Cesium.Primitive({

    geometryInstances: instances,

    appearance: new Cesium.PerInstanceColorAppearance()

}));
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multBox) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
