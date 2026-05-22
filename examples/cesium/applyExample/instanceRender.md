---
title: "实例化渲染 - Cesium.js 案例讲解"
description: "Cesium 多技术组合的应用 demo。入口在 `GridPrimitive`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,实例化渲染,应用相关"
outline: deep
---

# 实例化渲染

*Instance Render*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=instanceRender)


![实例化渲染](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/application/instanceRender.jpg)


## 效果说明

Cesium 多技术组合的应用 demo。入口在 `GridPrimitive`。

> 应用相关 · Cesium.js

## 实现思路

- 局部 ENU → 世界坐标：`Transforms.eastNorthUpToFixedFrame`，雷达/箭头类特效常用。

## 类与方法

### GridPrimitive

- `constructor()` — 参数：modelMatrix, vs, fs, row, uniformMap
- `isDestroyed()` — 经纬高 ↔ Cartesian3
- `createCommand()` — 经纬高 ↔ Cartesian3
- `update()` — 每帧更新 geometry uniform 或实例矩阵

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

const defaultvs = `
    in vec3 position;
    in vec3 normal;
    out vec3 v_color;
    out vec3 v_normal;
    uniform int irow;
    void main(){
    float instanceId = float(gl_InstanceID);

    int rows = irow * irow;
    float dz = float(gl_InstanceID / rows);
    int sub = gl_InstanceID % rows;

    float dx = float(sub / irow);
    float dy = float(sub % irow);
    float d = 2560.;
    vec3 tp = position + vec3(d * dx, d * dy, dz * d);
    v_color = vec3(dx / 128., dy / 128., dz / 128.);

    gl_Position = czm_projection  * czm_modelView * vec4( tp , 1. );
    }
`;
const defaultfs = `
    uniform vec3 color;
    in vec3 v_color;
    out vec4 out_fragColor;
    void main(){
    out_fragColor=vec4( v_color , 1. );
    }
`;

export default class GridPrimitive {
    constructor(modelMatrix, vs, fs, row, uniformMap) {
        this.modelMatrix = modelMatrix || Cesium.Matrix4.IDENTITY.clone()
        this.drawC
```

