---
title: "官方点聚合 - Cesium.js 案例讲解"
description: "本案例展示 **官方点聚合 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层、Tween 补间动画。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,官方点聚合"
outline: deep
---
# 官方点聚合

*Official Points Cluster*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=officialPointCluster)

![官方点聚合](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/officialPointCluster.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层
- Tween 补间动画

## 效果说明

本案例展示 **官方点聚合 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层、Tween 补间动画。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

- 属性插值动画，适合相机动效、UI 过渡。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`createClusterCanvas()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
    const lat = Cesium.Math.randomBetween(-50, 50);

    // 向数据源中添加一个实体（Entity）
    // Entity是Cesium中表示任何地理对象的基本单位
    dataSource.entities.add({
        // 设置实体的位置，使用经纬度转为笛卡尔坐标
        // fromDegrees方法将经纬度（单位：度）转换为笛卡尔坐标（单位：米）
        // 参数：经度、纬度、高度（这里设为0，即贴地）
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 0),
        point: {
            pixelSize: 15,                    // 点的像素大小
            color: Cesium.Color.YELLOW,          // 点的颜色
            outlineColor: Cesium.Color.WHITE, // 点的边框颜色
            outlineWidth: 3                   // 点的边框宽度
        },
    });
}

// 4. 启用聚合
// 获取数据源的聚合功能对象，这是控制点聚合行为的核心接口
// 每个DataSource都有一个clustering属性，用于控制该数据源中实体的聚合行为
const clustering = dataSource.clustering;

// 启用聚合功能，设置为true后，当地图缩放到一定程度时，相近的点会自动聚合
clustering.enabled = true;

// 设置聚合像素范围（单位：像素）
// 当两个点在屏幕上的距离小于这个值时，它们会被聚合为一个点
// 值越大，聚合效果越明显，聚合的点会越多
clustering.pixelRange = 100;

// 设置最小聚合数量
// 当聚合区域内的点数量不少于这个值时才进行聚合
// 小于这个数量的点会保持独立显示，避免对少量点也进行不必要的聚合
clustering.minimumClusterSize = 3;

// 聚合图标缓存对象，用于存储已创建的聚合图标
// 以聚合点数量为键，图标为值
// 避免重复创建相同数量的聚合图标，提高性能
const cache = {};

// 5. 自定义聚合样式
// 监听聚合事件，当点被聚合时会触发此事件
// 这个事件在每次地图视角变化导致聚合状态改变时都会触发
// clusteredEntities: 被聚合到一起的实体数组
// cluster: 聚合后的对象，包含聚合点的位置、标签等信息
clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
    // 隐藏默认的标签显示（Cesium默认会显示聚合数量的标签）
    // 我们将使用自定义的billboard来显示聚合点
    cluster.label.show = false;

    // 显示自定义的聚合图标（billboard）
    cluster.billboard.show = true;

    // 设置聚合点的垂直对齐方式为底部对齐
    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

    // 获取聚合点包含的实体数量，这个数量决定了聚合点的样式
    const count = clusteredEntities.length;

    // 从缓存中查找是否有对应数量的聚合图标
    let img = cache[count];

    // 如果缓存中没有对应数量的图标，则创建新的图标
    if (!img) {
        // 根据聚合点数量动态调整图标大小，数量越多图标越大
        // Math.min确保图标不会过大，最大为100像素
        // 30是基础大小，count/10是根据数量增加的大小
        const size = Math.min(100, 30 + count / 10);

        // 调用自定义函数创建聚合图标
        img = createClusterCanvas(size, count);

        // 将新创建的图标存入缓存，下次可以直接使用
        cache[count] = img;
    }

    // 设置聚合点的图标为刚刚获取或创建的图标
    cluster.billboard.image = img;
});

/**
 * 工具函数：生成聚合图标
 * 创建一个显示聚合数量的圆形图标
 * 
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=officialPointCluster) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
