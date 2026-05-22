---
title: "地球贴图 - Cesium.js 案例讲解"
description: "Cesium 多技术组合的应用 demo。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,地球贴图,应用相关"
outline: deep
---

# 地球贴图

*Globe Map*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=globeMap)


![地球贴图](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/application/globeMap.jpg)


## 效果说明

Cesium 多技术组合的应用 demo。

> 应用相关 · Cesium.js

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

const primitive = viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.EllipsoidGeometry({
            vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,
            radii: viewer.scene.globe.ellipsoid.radii,
        }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
            fabric: {
                type: "Image",
                uniforms: {
                    image: FILE_HOST + 'images/map/earth_clouds.png',
                    alpha: 0.5,
                    // repeat: new Cesium.Cartesian2(4.0, 4.0),
                    // color: Cesium.Color.YELLOW,
                },
                components: {
                    alpha: "texture(image, fract(materialInput.st * repeat)).r * alpha",
                    diffuse: "color.rgb", // 使用 color 作为漫反射颜色
                },
            
```

