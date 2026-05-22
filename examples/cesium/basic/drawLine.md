---
title: "绘制线段 - Cesium.js 案例讲解"
description: "本案例展示 **绘制线段 ** 的实现。涉及：Cesium Viewer 初始化、Cesium Entity 高层 API、Cesium 鼠标拾取交互。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,绘制线段"
outline: deep
---
# 绘制线段

*Draw drawLine*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=drawLine)

![绘制线段](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/drawLine.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium Entity 高层 API
- Cesium 鼠标拾取交互
- Cesium 影像图层
- GUI 面板调试参数

## 效果说明

本案例展示 **绘制线段 ** 的实现。涉及：Cesium Viewer 初始化、Cesium Entity 高层 API、Cesium 鼠标拾取交互。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **Entity** 加点线面、模型、标签；适合业务对象与交互。

- **ScreenSpaceEventHandler** 监听点击；`scene.pick` 取 Entity，`pickPosition` 取地表坐标。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 配置 ScreenSpaceEventHandler 交互
4. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`clearLineEntities()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initLineDrawing()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`calculateAndDisplayDistance()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`updateRealTimeDistance()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`customLabel()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'
const box = document.getElementById('box')

/**
 * @namespace CONFIG
 * @description 全局配置对象，包含所有可自定义的参数
 */
const CONFIG = {
    /**
     * @namespace point
     * @memberof CONFIG
     * @property {number} pixelSize - 像素大小
     * @property {Cesium.Color} color - 颜色
     * @property {Cesium.Color} outlineColor - 边框颜色
     * @property {number} outlineWidth - 边框宽度
     */
    point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
    },

    /**
     * @namespace label
     * @memberof CONFIG
     * @property {string} font - 字体
     * @property {Cesium.Color} fillColor - 填充颜色
     * @property {Cesium.Color} outlineColor - 边框颜色
     * @property {number} outlineWidth - 边框宽度
     * @property {Cesium.LabelStyle} style - 样式
     * @property {Cesium.VerticalOrigin} verticalOrigin - 垂直对齐方式
     */
    label: {
        font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },

    /**
     * @namespace line
     * @memberof CONFIG
     * @property {number} width - 宽度
     * @property {Cesium.Color} material - 材质
     * @property {boolean} clampToGround - 是否贴地
     */
    line: {
        width: 5,
        material: Cesium.Color.RED.withAlpha(1),
        clampToGround: true,
    },

    /**
     * @namespace tempLine
     * @memberof CONFIG
     * @property {number} width - 宽度
     * @property {Cesium.Color} material - 材质
     * @property {boolean} clampToGround - 是否贴地
     */
    tempLine: {
        width: 3,
        material: Cesium.Color.RED.withAlpha(0.5),
        clampToGround: true,
    }
};

// ==================== 初始化区域 ====================
/**
 * 初始化Cesium Viewer
 * @type {Cesium.Viewer}
 */
const viewer = new Cesium.Viewer(box, {
    animation: false,           // 是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,     // 是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    fullscreenButton: false,    // 是否显示全屏按钮，右下角全屏选择按钮
    timeline: false,            // 是否显示时间轴    
    infoBox: false,             // 是否显示信息框   
});

viewer.camera.flyTo({
    duration: 2,
    destination: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 10000),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
    },
});

// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";

/** 
 * 存储线实体
 * @type {Array<Cesium.Entity>}
 */
let lineEntities = [];

/** 
 * 用于存储临时线条实体
 * @type {Cesium.Entity}
 */
let tempLineEntity = null;

/** 
 * 用于存储绘制线的点
 * @type {Array<Cesium.Cartesian3>}
 */
let drawLinePositions = [];

/** 
 * 用于显示距离信息的标签实体
 * @type {Cesium.Entity}
 */
let distanceLabelEntity = null;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=drawLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
