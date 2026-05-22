---
title: "Canvas 文字点 - Cesium.js 案例讲解"
description: "Canvas 绘制城市名 + BillboardCollection 贴图批量标注"
head:
  - - meta
    - name: keywords
      content: "cesium.js,Canvas,Billboard,文字标注"
outline: deep
---

# Canvas 文字点

*Canvas Text Billboards*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=multText)

![Canvas 文字点](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/multText.jpg)

## 你将学到什么

- 用 **Canvas 2D** 动态生成文字纹理
- **devicePixelRatio × dpr** 高清屏清晰文字
- 纹理作为 **Billboard.image** 批量贴到城市坐标

## 效果说明

加载 city.json，每个城市名渲染成彩色 canvas，再以 billboard 形式钉在对应经纬度。

## 核心概念

### createCanvasText 工厂

```js
function createCanvasText(params) {
    const { dpr, fontSize, maxWidth } = { dpr: 1, maxWidth: 100, fontSize: 20, ...params };
    const ratio = window.devicePixelRatio * dpr;
    canvas.width = maxWidth * ratio;
    canvas.height = fontSize * ratio;
    ctx.scale(ratio, ratio);
    // 返回 (opts) => canvas.toDataURL() 或 canvas 本身
}
```

每次调用 `updateCanvasText({ text: key, color })` 重绘并返回 image 源。

### 为何不用 Label？

| Label | Canvas Billboard |
|-------|------------------|
| 字体样式有限 | 任意 CSS 字体、描边、背景 |
| 每 Entity 开销 | Collection 合批 |
| 适合少量 | 适合上百城市名 |

## 实现步骤

1. fetch city.json → `{ 城市名: [lon, lat] }`
2. `createCanvasText({ dpr: 1.4 })` 得 update 函数
3. `BillboardCollection` 循环 add，`image: updateCanvasText({ text, color })`
4. `flyTo` 中国上空总览

## 代码要点

```js
const updateCanvasText = createCanvasText({ dpr: 1.4 });
const billboards = new Cesium.BillboardCollection();
viewer.scene.primitives.add(billboards);

for (const key in citys) {
    const [longitude, latitude] = citys[key];
    billboards.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        image: updateCanvasText({ text: key, color: getColor() }),
        scale: 0.5,
    });
}
```

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/multText.js)。

## 小结

- Canvas → dataURL/canvas 是 Cesium 自定义图标的标准套路
- 上一篇：[海量曲线](/examples/cesium/basic/multCurve) · 下一篇：[海量 Box](/examples/cesium/basic/multBox)

> 基础功能 · Cesium.js · 13/19
