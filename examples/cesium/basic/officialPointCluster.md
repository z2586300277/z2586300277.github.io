---
title: "官方点聚合 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `createClusterCanvas`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,官方点聚合"
outline: deep
---

# 官方点聚合

*Official Points Cluster*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=officialPointCluster)


![官方点聚合](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/officialPointCluster.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `createClusterCanvas`。

> 基础功能 · Cesium.js

## 源码

```js
import * as Cesium from 'cesium'
const DOM = document.getElementById('box')
const viewer = new Cesium.Viewer(DOM, {
    animation: false,              // 是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,        // 是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    fullscreenButton: false,       // 是否显示全屏按钮，右下角全屏选择按钮
    timeline: false,               // 是否显示时间轴    
    infoBox: false                 // 是否显示信息框   
})

// 1. 隐藏Cesium Logo版权信息，保持界面简洁
// _cesiumWidget是Viewer的内部组件，_creditContainer是显示版权信息的DOM元素
viewer._cesiumWidget._creditContainer.style.display = "none"
// 2. 创建数据源并添加进 Viewer
// CustomDataSource是Cesium中用于管理自定义实体集合的数据源
// 与Cesium内置的数据源（如KML、GeoJSON等）不同，CustomDataSource允许完全自定义实体
// 'points'是这个数据源的唯一标识名称
const dataSource = new Cesium.CustomDataSource('points');

// 将自定义数据源添加到Viewer的数据源集合中
// 这样数据源中的实体就会在地球上显示出来
viewer.dataSources.add(dataSource);

// 3. 随机生成 10000 个点
// 创建大量随机分布的点用于演示聚合效果
// 实际项目中，这些点数据可能来自API调用、文件加载等方式
const randomPoints = 10000;

// 循环创建5000个随机点实体
for (let i = 0; i < randomPoints; i++) {
    // 使用Cesium.Math.randomBetween方法在指定范围内生成随机数
    // 经度范围：-180到180度（全球范围）
    // 纬度范围：-60到60度（避免极地地区，因为投影变形较大）
    const lon = Cesium.Math.randomBetween(-180, 180);
    const lat =
```

