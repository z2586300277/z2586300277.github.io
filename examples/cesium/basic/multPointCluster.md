---
title: "cesium大量点聚合 - Cesium.js 案例讲解"
description: "本案例展示 **cesium大量点聚合 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,cesium大量点聚合"
outline: deep
---
# cesium大量点聚合

*Points Cluster*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multPointCluster)

![cesium大量点聚合](https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/multPointCluster.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

## 效果说明

本案例展示 **cesium大量点聚合 ** 的实现。涉及：Cesium Viewer 初始化、Cesium 影像图层。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`setClusterCollection()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
/* 注 Supercluster 依赖请自行引入  此处我为 src 引入 */
import * as Cesium from 'cesium'

const DOM = document.getElementById('box')

const viewer = new Cesium.Viewer(DOM, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

viewer._cesiumWidget._creditContainer.style.display = "none"

viewer.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(116.3974, 39.9093, 18000000) }) // 设置视角

const citys = await fetch('https://z2586300277.github.io/three-editor/dist/files/other/city.json').then(res => res.json()) // 获取城市数据

const points = Object.values(citys).map((val, k) => ({ type: 'Feature', pid: k + '-' + val[0] + '-' + val[1], geometry: { coordinates: val } }))

// 建立聚合
setClusterCollection(viewer, points, (billboards, data) => {

    const [longitude, latitude] = data.geometry.coordinates

    const { pid } = data

    billboards.add({

        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),

        image: 'https://z2586300277.github.io/three-editor/dist/site.png', // 你的图片路径

        scale: 0.05,

        eyeOffset: new Cesium.Cartesian3(0, 0, 150), // 偏移高度

        id: pid

    })

})

/* 聚合方法 */
function setClusterCollection(viewer, points, callback = () => { }, options = {}) {

    // 创建聚合
    const supercluster = new Supercluster({ radius: 40, extent: 512, minZoom: 0, maxZoom: 16, ...options }) // 密集程度 radius, 切片大小 extent, 最小层级 minZoom, 最大层级 maxZoom

    supercluster.load(points)

    // 初始化聚合
    const clusters = supercluster.getClusters([-180, -85, 180, 85], 2)

    // 获取当前视角的边界
    const getBounds = () => {

        const bbox = viewer.camera.computeViewRectangle()

        return [bbox.west, bbox.south, bbox.east, bbox.north].map(i => Cesium.Math.toDegrees(i))  // minx, miny, maxx, maxy westLng, southLat, eastLng, northLat

    }

    // 获取当前视角的层级
    const getLevel = () => {

        var tileRender = viewer.scene.globe._surface._tilesToRender;

        if (tileRender && tileRender.length > 0) {

            return tileRender[0]._level

        }

    }

    // 创建billboard集合对象
    const billboards = viewer.scene.primitives.add(new Cesium.BillboardCollection())

    const setBillboards = arr => arr.forEach((cluster) => {

        let returnCluster = cluster

        // 判断聚合点
        if (cluster?.properties?.cluster) {

            const clusterId = cluster.properties.cluster_id

            const clusterCoordinates = cluster.geometry.coordinates

            const leaves = supercluster.getLeaves(clusterId, Infinity, 0)

            // 初始化最小距离和最接近的点
            let minDistance = Infinity

            let closestPoint = null

            // 遍历所有原始点
            for (const leaf of leaves) {

                // 计算原始点与聚合点的距离
                const leafCoordinates = leaf.geometry.coordinates

                const distance = Cesium.Cartesian3.distance(

                    Cesium.Cartesian3.fromDegrees(...clusterCoordinates),

                    Cesium.Cartesian3.fromDegrees(...leafCoordinates)

                )

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multPointCluster) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
