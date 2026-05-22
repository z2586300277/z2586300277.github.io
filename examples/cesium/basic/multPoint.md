---
title: "海量点 - Cesium.js 案例讲解"
description: "BillboardCollection 64800 个全球格网点，Primitive 层批量渲染"
head:
  - - meta
    - name: keywords
      content: "cesium.js,BillboardCollection,海量点,Primitive"
outline: deep
---

# 海量点

*Mass Points*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multPoint)

![海量点](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multPoint.jpg)

## 你将学到什么

- **BillboardCollection** 相对 Entity 的性能优势
- 双重 for 循环生成 **64800** 个格网点
- 每个 billboard 设 **id** 供 pick 识别

## 效果说明

全球每 1° 经纬交点处放置一张小图标，随机着色；点击可在控制台输出 `object.id`。

## 核心概念

| 方式 | 适用规模 | API |
|------|---------|-----|
| Entity.point | 数百以内 | `entities.add` |
| **BillboardCollection** | 数万 | `scene.primitives.add` |
| PointPrimitiveCollection | 数十万点（无图标） | 同 Primitive 层 |

```js
const billboards = new Cesium.BillboardCollection();
viewer.scene.primitives.add(billboards);

billboards.add({
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
    image: HOST + '/files/author/z2586300277.png',
    scale: 0.1,
    color: new Cesium.Color(Math.random(), Math.random(), Math.random(), 1),
    id: 'billboard-' + longitude + '-' + latitude,
});
```

Entity 每个点一个 draw call；Collection **合批** 同纹理 billboard。

## 实现步骤

1. `camera.setView` 定初始全球视角
2. 创建 `BillboardCollection` 并 add 到 scene
3. 经度 -180~180、纬度 -90~90 双重循环 add
4. `LEFT_CLICK` + `scene.pick` 读 id

## 代码要点

```js
for (var longitude = -180; longitude < 180; longitude++) {
    for (var latitude = -90; latitude < 90; latitude++) {
        billboards.add({
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
            image: HOST + '/files/author/z2586300277.png',
            scale: 0.1,
            id: 'billboard' + '-' + longitude + '-' + latitude,
        });
    }
}
```

::: tip 下一步
同图标海量点可聚合，见 [点聚合 Supercluster](/examples/cesium/basic/multPointCluster) 与 [官方聚合](/examples/cesium/basic/officialPointCluster)。
:::

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/multPoint.js)。

## 小结

- Primitive 层 + Collection = 海量可视化基础套路
- 上一篇：[GeoJSON 面](/examples/cesium/basic/geojsonFace) · 下一篇：[点聚合 Supercluster](/examples/cesium/basic/multPointCluster)

> 基础功能 · Cesium.js · 9/19
