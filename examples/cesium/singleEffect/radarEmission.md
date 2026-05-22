---
title: "雷达探测 - Cesium.js 案例讲解"
description: "地表某点起雷达扫描：半透明椭球标范围，wall 扇面随 heading 旋转。入口在 `RadarPrimitiveMaterialProperty`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,singleEffect,雷达探测"
outline: deep
---
# 雷达探测

*Radar Emission*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=radarEmission)

![雷达探测](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/radarEmission.jpg)

## 你将学到什么

- 案例交互与参数可在在线编辑器中查看

## 效果说明

地表某点起雷达扫描：半透明椭球标范围，wall 扇面随 heading 旋转。入口在 `RadarPrimitiveMaterialProperty`。

> 单一效果 · Cesium.js

## 核心概念

- **Viewer** 管理地球与渲染；业务对象可用 **Entity**（高层）或 **Primitive**（高性能）。
- 坐标转换：经纬高 ↔ `Cartesian3` 是 Cesium 开发基础。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 源码

完整源码见 [在线案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=radarEmission)。

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=radarEmission) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [单一效果目录](/examples/cesium/singleEffect/)

> 单一效果 · Cesium.js
