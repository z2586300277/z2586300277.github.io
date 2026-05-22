---
title: "渐变色墙体 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `getColorRamp`。"
head:
  - - meta
    - name: keywords
      content: "渐变色墙体"
outline: deep
---

# 渐变色墙体

*Gradient Wall*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=gradientWall)


![渐变色墙体](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/gradientWall.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `getColorRamp`。

> 单一效果 · Cesium.js

## 实现思路

- Entity.wall 用 `fromDegreesArrayHeights` 的经纬高数组拼墙面，适合雷达扇形、电子围栏。

## 源码

```js
import * as Cesium from 'cesium'

// 获取Cesium容器元素，用于初始化Viewer
const box = document.getElementById('box')

// 初始化Cesium Viewer，配置相关选项
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
// 隐藏Cesium Logo版权信息
viewer._cesiumWidget._creditContainer.style.display = "none";

// 定义围墙的经纬度坐标和高度数据
// 格式为 [经度, 纬度, 高度...]，这里定义了一个矩形围墙
const positions = [
    115.6434, 28.76762, 10,  // 第一个点：东经115.6434度，北纬28.76762度，高度10米
    115.6432, 28.76762, 10,  // 第二个点：东经115.6432度，北纬28.76762度，高度10米
    115.6432, 28.76756, 10,  // 第三个点：东经115.6432度，北纬28.76756度，高度10米
    115.6434, 28.76756, 10,  // 第四个点：东经115.6434度，北纬28.76756度，高度10米
    115.6434, 28.76762, 10,  // 第五个点（闭合点）：回到第一个点位置
]

// 定义墙体的基本颜色
const color = Cesium.Color.YELLOW;

// 添加墙体实体到场景中
let wall = viewer.entities.add({
    wall: {
        // 设置墙体的位置，使用Cesium.Cartesian3.fromDegreesArrayHeights将经纬度高度数组转换为笛卡尔坐标
        posit
```

