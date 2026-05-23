---
title: "绘制文字 - Cesium.js 案例讲解"
description: "Entity Label 贴地文字、HeightReference 与 globe.getHeight 手动贴地"
head:
  - - meta
    - name: keywords
      content: "cesium.js,Label,贴地,HeightReference,getHeight"
outline: deep
---

# 绘制文字

*Draw Text*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=CesiumJS&classify=basic&id=cesiumText)

![绘制文字](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/layer/defaultLayer.jpg)

## 你将学到什么

- **Entity.label** 绘制场景内文字
- **HeightReference.CLAMP_TO_GROUND** 自动贴地
- **globe.getHeight** 查询地形高度后手动设高
- **disableDepthTestDistance** 避免被地形遮挡

## 效果说明

地球上有三组标注：**贴地**（随地形起伏）、**不贴地**（固定 2000m 高度）、**自动计算贴地**（等地形加载后用 `getHeight` 取高程再放置）。

## 核心概念

### Entity Label

```js
label: {
    text: '贴地',
    font: '14pt monospace',
    outlineWidth: 2,
    showBackground: true,
    backgroundColor: Cesium.Color.WHITE,
    verticalOrigin: Cesium.VerticalOrigin.TOP,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
}
```

| 属性 | 作用 |
|------|------|
| `heightReference` | `CLAMP_TO_GROUND` 贴椭球/地形；默认 `NONE` 用 position 高度 |
| `disableDepthTestDistance` | 设为 ∞ 时 label 始终可见，不被地形 depth test 裁掉 |
| `verticalOrigin` | 文字相对锚点的垂直对齐 |

### 手动查询地形高度

```js
viewer.scene.globe.depthTestAgainstTerrain = true;

const carto = Cesium.Cartographic.fromDegrees(lon, lat, 10);
const height = viewer.scene.globe.getHeight(
    new Cesium.Cartographic(carto.longitude, carto.latitude)
);
// 需在 terrain 加载完成后调用，否则 height 可能为 undefined
```

### 动态修改

Entity 属性可运行时赋值：

```js
text.label.text = '贴地文字';
text.label.fillColor = Cesium.Color.RED;
```

## 实现步骤

1. 开启 `depthTestAgainstTerrain` 使贴地 label 与地形正确遮挡
2. 添加贴地 Entity（point + label，`CLAMP_TO_GROUND`）
3. 添加高空 Entity 作对比（无 heightReference）
4. `flyTo` 到第三点后，在 `complete` 回调里延迟 `getHeight` 再 add Entity

## 代码要点

```js
var text = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
    point: { pixelSize: 5, color: Cesium.Color.RED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND },
    label: {
        text: '贴地',
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    }
});

var world = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(-95.166493, 39.9060534, 2000),
    label: { text: '不贴地' }  // 无 heightReference，悬浮 2000m
});
```

::: tip Label vs DOM
简单标注用 **Entity.label**（GPU 渲染）；复杂 HTML 面板见 [CSS 元素](/examples/cesium/basic/cssElement)。
:::

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/cesiumText.js)。

## 小结

- 有地形时优先 `CLAMP_TO_GROUND`；精确高度用 `sampleTerrain` / `getHeight`
- 上一篇：[自动旋转](/examples/cesium/basic/autoRotate) · 下一篇：[CSS 元素](/examples/cesium/basic/cssElement)

> 基础功能 · Cesium.js · 4/19
