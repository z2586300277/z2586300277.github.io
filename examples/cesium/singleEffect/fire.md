---
title: "粒子（火焰） - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。入口在 `FireEffect`。"
head:
  - - meta
    - name: keywords
      content: "粒子"
outline: deep
---

# 粒子（火焰）

*Particle(Fire)*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=fire)


![粒子（火焰）](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/fire.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。入口在 `FireEffect`。

> 单一效果 · Cesium.js

## 实现思路

- Cesium 内置粒子系统，发射器 + `ParticleBurst`，适合雨、雪、火焰（与 Three 粒子思路不同，挂在 scene 上）。

## 类与方法

### FireEffect

- `constructor()` — 参数：viewer, obj
- `init()`
- `preUpdateEvent()`
- `computeModelMatrix()` — 经纬高 ↔ Cartesian3
- `computeEmitterModelMatrix()` — 移除 Entity / 解绑监听
- `removeEvent()` — 移除 Entity / 解绑监听
- `remove()` — 移除 Entity / 解绑监听

## 源码

```js
import * as Cesium from 'cesium'

const box = document.getElementById('box')
const viewer = new Cesium.Viewer(box, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),
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
    skyBox: new Cesium.SkyBox({ show: false })
})

viewer.scene.debugShowFramesPerSecond = true;
viewer.scene.globe.depthTestAgainstTerrain = true;

//火焰特效
class FireEffect {
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
        this.translation = new Cesi
```

