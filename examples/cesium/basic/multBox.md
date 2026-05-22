---
title: "海量 Box - Cesium.js 案例讲解"
description: "BoxGeometry + eastNorthUpToFixedFrame 万级实例合批"
head:
  - - meta
    - name: keywords
      content: "cesium.js,BoxGeometry,GeometryInstance,合批"
outline: deep
---

# 海量 Box

*Mass Boxes*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multBox)

![海量 Box](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multBox.jpg)

## 你将学到什么

- **BoxGeometry.fromDimensions** 创建立方体
- **Transforms.eastNorthUpToFixedFrame** 贴地定向
- 10000 个 instance 单次 Primitive 渲染

## 效果说明

全球随机 10000 个半透明红色长方体，尺寸约 40km×30km×500km（夸张高度便于远距可见）。

## 核心概念

```js
const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);
const dimensions = new Cesium.Cartesian3(40000.0, 30000.0, 500000.0);

instances.push(new Cesium.GeometryInstance({
    geometry: Cesium.BoxGeometry.fromDimensions({
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
        dimensions,
    }),
    modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
    attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.RED.withAlpha(0.2)
        ),
    },
}));

viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PerInstanceColorAppearance(),
}));
```

**eastNorthUpToFixedFrame**：以该经纬点为原点，东-北-天为局部轴，box 竖直「长」向天顶。

## 实现步骤

1. 循环 10000 次随机经纬
2. push GeometryInstance 到数组
3. 一个 Primitive 提交全部 instance

## 小结

- 与 [海量面线](/examples/cesium/basic/multFaceLine) 同一合批思路，几何换 Box
- 上一篇：[Canvas 文字点](/examples/cesium/basic/multText) · 下一篇：[加载模型](/examples/cesium/basic/loadModel)

> 基础功能 · Cesium.js · 14/19
