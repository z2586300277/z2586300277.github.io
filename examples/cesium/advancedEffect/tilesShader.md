---
title: "智慧城市着色器 - Cesium.js 案例讲解"
description: "Cesium Shader、3D Tiles 等进阶。主流程在 `task`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,智慧城市着色器"
outline: deep
---

# 智慧城市着色器

*SmartCity*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=advancedEffect&id=tilesShader)


![智慧城市着色器](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/tilesShader.jpg)


## 效果说明

Cesium Shader、3D Tiles 等进阶。主流程在 `task`。

> 高级特效 · Cesium.js

## 实现思路

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

- Model / 3D Tiles 上挂 `CustomShader`，直接写 GLSL 改 `czm_modelMaterial`。

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

const tileset = await Cesium.Cesium3DTileset.fromUrl(`https://g2657.github.io/gz-city/tileset.json`)

viewer.scene.primitives.add(tileset)

viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.1, tileset.boundingSphere.radius * 0.5))

class SweepShader extends Cesium.CustomShader {

    constructor(opt = {}) {
        const { sweepColor = new Cesium.Color.fromCssColorString('green'),
            mixColor1 = new Cesium.Color.fromCssColorString('red'),
            mixColor2 = new Cesium.Color.fromCssColorString('white')
        } = opt;

        super({
            vertexShaderText: `void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
                // 注意这里的uv，详情看本系列第一篇文章
                v_uv = vec2(vsInput.attributes.positionMC.z / 80., vsInput.attributes.positionMC.z / 250.);
              }`,
            fragmentShaderText: `float random(vec2 st) {

      
```

