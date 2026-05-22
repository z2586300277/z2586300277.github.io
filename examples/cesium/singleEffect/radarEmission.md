---
title: "雷达探测 - Cesium.js 案例讲解"
description: "地表某点起雷达扫描：半透明椭球标范围，wall 扇面随 heading 旋转。入口在 `RadarPrimitiveMaterialProperty`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,雷达探测,单一效果"
outline: deep
---

# 雷达探测

*Radar Emission*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=radarEmission)


![雷达探测](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/radarEmission.jpg)


## 效果说明

地表某点起雷达扫描：半透明椭球标范围，wall 扇面随 heading 旋转。入口在 `RadarPrimitiveMaterialProperty`。

> 单一效果 · Cesium.js

## 实现思路

- 自定义 Fabric 材质：向 `Material._materialCache` 注册 type，在 `czm_getMaterial` 里改 diffuse/alpha。`Property.getValue` 每帧回传 uniform（常见是 `time`），驱动纹理滚动或颜色变化。

## 类与方法

### RadarPrimitiveMaterialProperty

- `constructor()` — 参数：options = {}
- `getType()` — 返回已注册的 Material fabric type 字符串
- `getValue()` — Property 接口：按 simulation time 返回 uniform 对象，供 Fabric 材质读取
- `equals()` — Property 相等性比较，避免重复注册

## 独立函数

- `registerRadarMaterial()` — 材质 / GLSL
- `createRadarCone()` — 经纬高 ↔ Cartesian3

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

// 1. 雷达材质效果实现
class RadarPrimitiveMaterialProperty {
  constructor(options = {}) {
    this._definitionChanged = new Cesium.Event();
    this.opts = {
      color: Cesium.Color.RED,
      duration: 2000,
      time: new Date().getTime(),
      repeat: 30,
      offset: 0,
      thickness: 0.3,
      ...options,
    };

    // 将属性转换为Cesium属性对象
    this._color = new Cesium.ConstantProperty(this.opts.color);
    this._time = this.opts.time;
    this._duration = this.opts.duration;
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType() {
    return Cesium.Material.radarPrimitiveType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
      result.color
    );
    result.time = ((n
```

