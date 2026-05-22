---
title: "海量曲线 - Cesium.js 案例讲解"
description: "CatmullRomSpline 样条插值 + PolylineGeometry 批量飞线"
head:
  - - meta
    - name: keywords
      content: "cesium.js,CatmullRomSpline,曲线,PolylineGeometry"
outline: deep
---

# 海量曲线

*Mass Curves*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multCurve)

![海量曲线](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multCurve.jpg)

## 你将学到什么

- **CatmullRomSpline** 过控制点生成平滑曲线
- `multiplier` 控制插值细分密度
- 300+ 条随机曲线合批为单个 Primitive

## 效果说明

先用 5 个中国城市坐标画一条示范曲线，再随机 300 条跨洋曲线，颜色随机、半透明。

## 核心概念

### 样条插值

```js
const spline = new Cesium.CatmullRomSpline({
    times: [0, 0.25, 0.5, 0.75, 1],  // 归一化参数
    points: cartesianPoints,          // Cartesian3 控制点
});

for (let i = 0; i < numOfPoints; i++) {
    const time = i / (numOfPoints - 1);
    curvePoints.push(spline.evaluate(time));
}
```

`numOfPoints = 控制点数 × multiplier`，multiplier 越大曲线越 smooth、顶点越多。

### 与直线飞线区别

| 方式 | 路径 |
|------|------|
| 直线 | 控制点依次相连 |
| **Catmull-Rom** | 过所有控制点的平滑弧线，适合迁徙/物流可视化 |

## 实现步骤

1. `setCurveCollection` 封装 `generateCurvePoints` + instance 收集
2. 添加京沪广深杭 5 点示范曲线
3. 循环 300 次随机 5 控制点（10 个度数）生成曲线
4. 一个 `Primitive` + `PolylineColorAppearance` 提交

## 代码要点

```js
function generateCurvePoints(flattenedPoints, multiplier = 30) {
    const points = [];
    for (let i = 0; i < flattenedPoints.length; i += 2) {
        points.push([flattenedPoints[i], flattenedPoints[i + 1]]);
    }
    const cartesianPoints = points.map(p => Cesium.Cartesian3.fromDegrees(p[0], p[1]));
    const spline = new Cesium.CatmullRomSpline({
        times: points.map((_, i) => i / (points.length - 1)),
        points: cartesianPoints,
    });
    // ... evaluate 采样
}
```

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/multCurve.js)。

## 小结

- 飞线/弧线大屏常用 CatmullRom + Primitive 合批
- 上一篇：[海量面线](/examples/cesium/basic/multFaceLine) · 下一篇：[Canvas 文字点](/examples/cesium/basic/multText)

> 基础功能 · Cesium.js · 12/19
