---
title: "动态围墙(简易版) - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `addWalls`。"
head:
  - - meta
    - name: keywords
      content: "动态围墙(简易版)"
outline: deep
---

# 动态围墙(简易版)

*dynamicWall Simple*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=dynamicWallSimple)


![动态围墙(简易版)](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/dynamicWallSimple.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `addWalls`。

> 单一效果 · Cesium.js

## 独立函数

- `addWalls()` — 材质 / GLSL

## 源码

```js
import * as Cesium from 'cesium'

// 获取Cesium容器元素
const box = document.getElementById('box')

// 初始化Cesium Viewer
const viewer = new Cesium.Viewer(box, {
    // 禁用动画控件（左下角仪表）
    animation: false,
    // 禁用图层选择器（右上角图层选择按钮）
    baseLayerPicker: false,
    // 设置基础影像图层为ArcGIS影像服务
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    // 禁用全屏按钮（右下角全屏选择按钮）
    fullscreenButton: false,
    // 禁用时间轴控件
    timeline: false,
    // 禁用信息框
    infoBox: false,
})

// 启用地形深度检测，使墙体能够贴合地形
viewer.scene.globe.depthTestAgainstTerrain = true
// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";
// 定义围墙的经纬度坐标和高度数据
const positions = [
    115.6434, 28.76762,
    115.6432, 28.76762,
    115.6432, 28.76756,
    115.6434, 28.76756,
    115.6434, 28.76762,
]

// 设置相机视角，定位到围墙位置
viewer.camera.setView({
    // 相机目标位置（经度、纬度、高度）
    destination: Cesium.Cartesian3.fromDegrees(115.6433, 28.7674, 30),
    orientation: {
        // 偏航角（朝向），正北为0度
        heading: Cesium.Math.toRadians(0),
        // 俯仰角，-90度为垂直向下看
        pitch: Cesium.Math.toRadians(-45),
        // 翻滚角，0为不翻滚
        roll: 0
    }
})
// 调用函数创建动态围墙
addWalls(positions, 10)
/**
 * 创建动态围墙效果
 * @param {Array<Array<number>>} positionLonLat - 围墙顶点的经纬
```

