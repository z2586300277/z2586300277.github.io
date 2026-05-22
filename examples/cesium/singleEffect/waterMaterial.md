---
title: "水波材质 - Cesium.js 案例讲解"
description: "Cesium 地球上的 GIS 小特效。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,水波材质,单一效果"
outline: deep
---

# 水波材质

*Water Material*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=waterMaterial)


![水波材质](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/waterMaterial.jpg)


## 效果说明

Cesium 地球上的 GIS 小特效。

> 单一效果 · Cesium.js

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

// 添加水波纹效果
const positions = [-109.080842, 45.002073, -105.91517, 45.002073 , -104.058488, 46.996596]; // 示例坐标数组
const index = 1; // 示例索引

const primitives = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        id: 'waterRipple' + index,
        geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(positions)),
            height: 0,
        }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
            fabric: {
                type: "Water",
                uniforms: {
                    baseWaterColor: Cesium.Color.fromCssColorString('rgba(64,157,253,0.5)'),
                    blendColor: Cesium.Color.fromCssColorString('rgba(64,157,253,0.3)'),
                    normalMap: FILE_HOST + "images/drei/normal.jpg",
                    frequency: 500.0,
   
```

