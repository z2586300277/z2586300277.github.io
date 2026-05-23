---
title: "点聚合 Supercluster - Cesium.js 案例讲解"
description: "Supercluster 库 + BillboardCollection，camera.changed 动态刷新聚合"
head:
  - - meta
    - name: keywords
      content: "cesium.js,Supercluster,点聚合,BillboardCollection"
outline: deep
---

# 点聚合 Supercluster

*Point Cluster (Supercluster)*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=basic&id=multPointCluster)

![点聚合 Supercluster](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multPointCluster.jpg)

## 你将学到什么

- 引入 **Supercluster** 做屏幕空间聚合
- `getClusters(bbox, zoom)` 按视口与层级取簇
- **camera.changed** 监听视角变化重算
- 聚合点展开时取 **最近子点** 代表位置

## 效果说明

加载全国城市 JSON，缩放地图时相近城市合并为单图标；放大后拆散为独立 billboard。

## 核心概念

### Supercluster 流程

```
GeoJSON Feature[] → supercluster.load()
                         ↓
              getClusters([west,south,east,north], zoom)
                         ↓
              BillboardCollection.add / removeAll
```

```js
const supercluster = new Supercluster({
    radius: 40,    // 聚合半径（像素级算法参数）
    extent: 512,
    minZoom: 0,
    maxZoom: 16,
});
supercluster.load(points);
```

### 视口与层级

```js
const bbox = viewer.camera.computeViewRectangle();
const bounds = [west, south, east, north].map(i => Cesium.Math.toDegrees(i));

// 用当前渲染瓦片 level 近似 zoom
const level = viewer.scene.globe._surface._tilesToRender[0]._level;
const clusters = supercluster.getClusters(bounds, level);
```

### 聚合点代表位置

若 `cluster.properties.cluster` 为真，从 `getLeaves` 里找 **离簇中心最近** 的原始点，避免图标漂在空处。

## 实现步骤

1. fetch 城市 JSON，转为 `{ type:'Feature', geometry:{coordinates} }`
2. `setClusterCollection(viewer, points, callback)` 封装聚合
3. 初次 `setBillboards(clusters)`
4. `camera.changed` → `billboards.removeAll()` → 重新 getClusters → setBillboards

## 代码要点

```js
viewer.camera.changed.addEventListener(function () {
    const level = getLevel();
    if (!level) return;
    const clusters = supercluster.getClusters(getBounds(), level);
    billboards.removeAll();
    setBillboards(clusters);
});
```

::: tip 依赖
案例注释要求自行引入 **Supercluster**（npm 或 script）。官方内置方案见下一篇 [官方点聚合](/examples/cesium/basic/officialPointCluster)。
:::

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/multPointCluster.js)。

## 小结

- 外部 Supercluster 灵活可控；Cesium 内置 clustering 更简单
- 上一篇：[海量点](/examples/cesium/basic/multPoint) · 下一篇：[海量面线](/examples/cesium/basic/multFaceLine)

> 基础功能 · Cesium.js · 10/19
