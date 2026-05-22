---
title: "cesium大量立方体 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,cesium大量立方体"
outline: deep
---

# cesium大量立方体

*Multiple Cubes*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multBox)


![cesium大量立方体](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multBox.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。

> 基础功能 · Cesium.js

## 实现思路

- 局部 ENU → 世界坐标：`Transforms.eastNorthUpToFixedFrame`，雷达/箭头类特效常用。

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

    appearance: new Cesium.PerInstanc
```

