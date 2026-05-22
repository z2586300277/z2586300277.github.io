---
title: "城市光影 - Cesium.js 案例讲解"
description: "Cesium Shader、3D Tiles 等进阶。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,城市光影,高级特效"
outline: deep
---

# 城市光影

*City Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=advancedEffect&id=cityLight)


![城市光影](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/cityLight.jpg)


## 效果说明

Cesium Shader、3D Tiles 等进阶。

> 高级特效 · Cesium.js

## 实现思路

- 3D Tiles 倾斜摄影/白膜：`Cesium3DTileset.fromUrl`，可配 `heightReference`、style。

- Model / 3D Tiles 上挂 `CustomShader`，直接写 GLSL 改 `czm_modelMaterial`。

## 源码

```js
import * as Cesium from 'cesium'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

})

// https://guangfus:663/3dtiles/whiteModel/tileset.json
const tileset = await Cesium.Cesium3DTileset.fromUrl('https://g2657.github.io/gz-city/tileset.json')

viewer.scene.primitives.add(tileset)

tileset.maximumScreenSpaceError = 1

viewer.flyTo(tileset)

const uniforms = {
    u_sweep_color: { value: Cesium.Color.fromBytes(43, 167, 255, 255), type: Cesium.UniformType.VEC3 },
    u_mix_color1: { value: Cesium.Color.fromBytes(9, 9, 14, 255), type: Cesium.UniformType.VEC3 },
    u_mix_color2: { value: Cesium.Color.fromBytes(0, 128, 255, 255), type: Cesium.UniformType.VEC3 },
    u_sweep_width: { value: 0.03, type: Cesium.UniformType.FLOAT },
    u_time: { value: 0, type: Cesium.UniformType.FLOAT },
    u_model_height: { value: 100, type: Cesium.UniformType.FLOAT },
    u_height_offset: { value: 0.0, type: Cesium.UniformType.FLOAT }
}

const gui = new dat.GUI()
gui.addColor({ sweepColor: '#2ba
```

