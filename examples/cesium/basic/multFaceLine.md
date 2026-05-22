---
title: "海量面线 - Cesium.js 案例讲解"
description: "PolygonGeometry + PolylineGeometry 合批 Primitive 渲染万级三角面"
head:
  - - meta
    - name: keywords
      content: "cesium.js,Primitive,PolygonGeometry,PolylineGeometry,合批"
outline: deep
---

# 海量面线

*Mass Polygons & Polylines*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multFaceLine)

![海量面线](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multFaceLine.jpg)

## 你将学到什么

- **GeometryInstance** 收集大量面/线几何
- 单个 **Primitive** 一次 draw 多种 instance
- **PerInstanceColorAppearance** / **PolylineColorAppearance**

## 效果说明

随机生成 **10000** 个三角形面 + 对应边框线，红绿交替填充，白线描边。

## 核心概念

### 合批模式

```js
// 收集阶段
faceCollection.instances.push(new Cesium.GeometryInstance({
    geometry: new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(positions)
        ),
        height: 0,
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
    }),
    attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
    },
    id: 'face' + i,
}));

// 提交阶段 — 一个 Primitive 渲染全部面
viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: faceCollection.instances,
    appearance: new Cesium.PerInstanceColorAppearance({ closed: true }),
}));
```

线集合同理，用 `PolylineGeometry` + `PolylineColorAppearance`。

### positions 格式

本案例 `positions` 为 `[lon1, lat1, lon2, lat2, lon3, lat3]` 三角面三顶点（度）。

## 实现步骤

1. 封装 `faceCollection` / `lineCollection` 带 `add()` 方法 push instance
2. 循环 10000 次随机经纬生成三角
3. callback 结束后各 add 一个 Primitive

## 代码要点

```js
setFaceCollection(viewer, (faceCollection, lineCollection) => {
    for (var i = 0; i < 10000; i++) {
        var positions = [lon, lat, lon2, lat2, lon3, lat3];
        faceCollection.add({ positions, color: i % 2 == 0 ? 'red' : 'green', id: 'face' + i });
        lineCollection.add({ positions, color: '#fff', width: 1.0, opacity: 0.5, id: 'line' + i });
    }
});
```

::: warning 限制
合批 Primitive **不易单独 pick 改色**；需交互请用 Entity 或自定义 picking。
:::

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/multFaceLine.js)。

## 小结

- 静态大批量几何 → GeometryInstance + Primitive
- 上一篇：[点聚合 Supercluster](/examples/cesium/basic/multPointCluster) · 下一篇：[海量曲线](/examples/cesium/basic/multCurve)

> 基础功能 · Cesium.js · 11/19
