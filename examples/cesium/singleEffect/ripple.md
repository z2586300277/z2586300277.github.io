---
title: "水波纹 - Cesium.js 案例讲解"
description: "Cesium 地球上的 GIS 小特效。主流程在 `CircleWaveMaterialProperty`。"
head:
  - - meta
    - name: keywords
      content: "水波纹"
outline: deep
---

# 水波纹

*Ripple*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=ripple)


![水波纹](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/expand/ripple.jpg)


## 效果说明

Cesium 地球上的 GIS 小特效。主流程在 `CircleWaveMaterialProperty`。

> 单一效果 · Cesium.js

## 实现思路

- 自定义 Fabric 材质：向 `Material._materialCache` 注册 type，在 `czm_getMaterial` 里改 diffuse/alpha。`Property.getValue` 每帧回传 uniform（常见是 `time`），驱动纹理滚动或颜色变化。

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

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.36485552299206, 39.99754814959118, 5000.0)
});

/**
 * 水波纹扩散材质
 * @param {*} options
 * @param {String} options.color 颜色
 * @param {Number} options.duration 持续时间 毫秒
 * @param {Number} options.count 波浪数量
 * @param {Number} options.gradient 渐变曲率
 */
function CircleWaveMaterialProperty(options) {
    this._definitionChanged = new Cesium.Event();
    this.color = Cesium.defaultValue(options.color && new Cesium.Color.fromCssColorString(options.color), Cesium.Color.RED);
    this.duration = Cesium.defaultValue(options.duration, 1000);
    this.cou
```

