---
title: "烟雾效果 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。入口在 `smokeEffect`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,烟雾效果,单一效果"
outline: deep
---

# 烟雾效果

*Smoke Effect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=smokeEffect)


![烟雾效果](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/smokeEffect.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。入口在 `smokeEffect`。

> 单一效果 · Cesium.js

## 实现思路

- Cesium 内置粒子系统，发射器 + `ParticleBurst`，适合雨、雪、火焰（与 Three 粒子思路不同，挂在 scene 上）。

## 类与方法

### smokeEffect

- `constructor()` — 参数：viewer, obj
- `init()`
- `preUpdateEvent()`
- `computeModelMatrix()` — 经纬高 ↔ Cartesian3
- `computeEmitterModelMatrix()` — 经纬高 ↔ Cartesian3
- `applyGravity()` — 移除 Entity / 解绑监听
- `removeEvent()` — 移除 Entity / 解绑监听
- `remove()` — 移除 Entity / 解绑监听

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

viewer.scene.debugShowFramesPerSecond = true;
viewer.scene.globe.depthTestAgainstTerrain = true;

//喷雾特效
//烟特效
class smokeEffect {
    constructor(viewer, obj) {
        this.viewer = viewer
        this.viewModel = {
            emissionRate: 5,
            gravity: 0.0,//设置重力参数
            minimumParticleLife: 1,
            maximumParticleLife: 6,
            minimumSpeed: 1.0,//粒子发射的最小速度
            maximumSpeed: 4.0,//粒子发射的最大速度
            startScale: 0.0,
            endScale: 10.0,
            particleSize: 25.0,
        }
        this.emitterModelMatrix = new Cesium.Matrix4()
        this.translation = new Cesium.Cartesian3()
        this.rotation = new Cesium.Quaternion()
        this.hpr = new Cesium.HeadingPitchRoll()
        this.trs = new Cesium.TranslationRotationScale()
        this.scene = this.viewer.scene
        this.particleSystem = ''
        this.entity = this.viewer.entities.add({
           
```

