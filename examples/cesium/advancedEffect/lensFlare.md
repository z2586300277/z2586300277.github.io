---
title: "镜头光晕 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `initViewer`、`addLigh`。"
head:
  - - meta
    - name: keywords
      content: "镜头光晕，太阳效果"
outline: deep
---

# 镜头光晕

*Lens Flare*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=advancedEffect&id=lensFlare)


![镜头光晕](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/lensFlare.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `initViewer`、`addLigh`。

> 高级特效 · Cesium.js

## 实现思路

- 屏幕空间后期：`PostProcessStage` 或 `PostProcessStageLibrary` 里的 bloom、雨雪等全屏 Pass。

## 源码

```js
import * as Cesium from "cesium";

let viewer;
const initViewer = async () => {
  const DOM = document.getElementById("box");
  viewer = new Cesium.Viewer(DOM, {
    showGroundAtmosphere: false,
    depthTestAgainstTerrain: true,
    baseLayerPicker: false, // 是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),
    dynamicAtmosphereLightingFromSun: false,
  });
  viewer._cesiumWidget._creditContainer.style.display = "none";
  viewer.scene.globe.enableLighting = false;
  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  viewer.shadows = false;
  viewer.scene.skyAtmosphere.show = true;
  viewer._cesiumWidget._creditContainer.style.display = "none"
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2358297.6507743318, 4228376.427784441, 4174357.5367739797),
    orientation: {
      heading: 4.136152079327102,
      pitch: -0.1507722677698775,
      roll: 6.282377463720871
    },
    duration: 2
  });

  setTimeout(() => {
    addLigh();
  }, 3000);
};

const addLigh = async () => {
  const fragmentShader = `
      uniform sampler2D colorTexture;
      uniform sampler2D depthTexture;
      in vec2 v_textureCoordinates;
  
      float rnd(vec2 p) {
          float f = fract(sin(dot(p, vec2(12.1234, 72.8392))) * 45123
```

