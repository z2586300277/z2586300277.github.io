---
title: "雪景 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `initViewer`、`initScene`。"
head:
  - - meta
    - name: keywords
      content: "雪景，模型积雪"
outline: deep
---

# 雪景

*Snow Scene*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=advancedEffect&id=snow)


![雪景](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/snow.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `initViewer`、`initScene`。

> 高级特效 · Cesium.js

## 实现思路

- 屏幕空间后期：`PostProcessStage` 或 `PostProcessStageLibrary` 里的 bloom、雨雪等全屏 Pass。

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

- Model / 3D Tiles 上挂 `CustomShader`，直接写 GLSL 改 `czm_modelMaterial`。

## 着色器

### 片元

```glsl
precision highp float;
        uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        in vec2 v_textureCoordinates;
        float time;
        #define HASHSCALE1 .1031
        #define HASHSCALE3 vec3(.1031, .1030, .0973)
        #define HASHSCALE4 vec3(.1031, .1030, .0973, .1099)
        float SIZE_RATE = 0.1;
        float XSPEED = 0.2;
        float YSPEED = 0.5;
        float LAYERS = 10.;
        float Hash11(float p)
        {
            vec3 p3  = fract(vec3(p) * HASHSCALE1);
            p3 += dot(p3, p3.yzx + 19.19);
            return fract((p
```

## 源码

```js
import * as Cesium from "cesium";

let viewer;
let tileset;
let snowEffect;

const initViewer = () => {
  const DOM = document.getElementById("box");
  viewer = new Cesium.Viewer(DOM, {
    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,
  });
  initScene();
  let interval;
  interval = setInterval(() => {
    if (tileset.customShader.uniforms.u_snowAlpha.value >= 1.0) {
      window.clearInterval(interval);
      return false;
    }
    tileset.customShader.uniforms.u_snowAlpha.value += 0.01;
  }, 20);
};

const initScene = async () => {
  tileset = await Cesium.Cesium3DTileset.fromUrl(
    FILE_HOST + '3dtiles/house/tileset.json',
    {
      customShader: new Cesium.CustomShader({
        uniforms: {
          u_lightColor: {
            type: Cesium.UniformType.VEC3,
            value: new Cesium.Cartesian3(1, 1, 1),
          },
          u_snowAlpha: {
            type: Cesium.UniformType.FLOAT,
            value: 0,
          },
        },
        fragmentShaderText: `
              #define MAX_RADIUS 2
              #define DOUBLE_HASH 0
              #define HASHSCALE1 .1031
```

