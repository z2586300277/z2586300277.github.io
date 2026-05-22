---
title: "智慧城市光 - Cesium.js 案例讲解"
description: "Cesium Shader、3D Tiles 等进阶。主流程在 `setViewerTheme`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,智慧城市光,高级特效"
outline: deep
---

# 智慧城市光

*City Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=advancedEffect&id=smartCity)


![智慧城市光](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/smartCity.jpg)


## 效果说明

Cesium Shader、3D Tiles 等进阶。主流程在 `setViewerTheme`。

> 高级特效 · Cesium.js

## 实现思路

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

- Model / 3D Tiles 上挂 `CustomShader`，直接写 GLSL 改 `czm_modelMaterial`。

## 独立函数

- `setViewerTheme()` — 材质 / GLSL

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

  animation: false,

  baseLayerPicker: false,

  fullscreenButton: false,

  geocoder: false,

  homeButton: false,

  sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式

  sceneModePicker: false,

  navigationHelpButton: false,

  selectionIndicator: false,

  timeline: false,

  infoBox: false,

  scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源  

  orderIndependentTranslucency: false,

  contextOptions: { webgl: { alpha: true } },

  skyBox: new Cesium.SkyBox({ show: false }),

  baseLayer: false, // 不显示默认图层

})

viewer.imageryLayers.addImageryProvider(

  new Cesium.UrlTemplateImageryProvider({

    url: 'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=2&style=8&x={x}&y={y}&z={z}',

    maximumLevel: 18

  })

)

setViewerTheme(viewer) // 设置主题

function setViewerTheme(viewer, options = {}) {

  const baseLayer = viewer.imageryLayers.get(0)

  if (!baseLayer) return

  baseLayer.brightness = options.brightness ?? 0.6

  baseLayer.contrast = options.contrast ?? 1.8

  baseLayer.gamma = options.gamma ?? 0.3

  baseLayer.hue = options.hue ?? 1

  baseLayer.saturation = options.saturation || 0

  const baseFragShader = (viewer.scene.globe)._surfaceShaderSet.baseFragmentShaderSource.sou
```

