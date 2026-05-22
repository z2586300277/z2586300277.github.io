---
title: "cesium大量点聚合 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `setClusterCollection`、`getBounds`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,cesium大量点聚合"
outline: deep
---

# cesium大量点聚合

*Points Cluster*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multPointCluster)


![cesium大量点聚合](https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/multPointCluster.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `setClusterCollection`、`getBounds`。

> 基础功能 · Cesium.js

## 代码结构

- 注 Supercluster 依赖请自行引入  此处我为 src 引入
- 聚合方法

## 源码

### 注 Supercluster 依赖请自行引入  此处我为 src 引入

```js
import * as Cesium from 'cesium'

const DOM = document.getElementById('box')

const viewer = new Cesium.Viewer(DOM, {

    animation: false,

    baseLayerPicker: false,

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,

    timeline: false,

    infoBox: false,

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
```

### 聚合方法

```js
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
```

