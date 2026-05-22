---
title: "绘制线段 - Cesium.js 案例讲解"
description: "Cesium Scene/Camera/Renderer 基础搭建。主流程在 `clearLineEntities`、`initLineDrawing`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,绘制线段"
outline: deep
---

# 绘制线段

*Draw drawLine*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=drawLine)


![绘制线段](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/drawLine.jpg)


## 效果说明

Cesium Scene/Camera/Renderer 基础搭建。主流程在 `clearLineEntities`、`initLineDrawing`。

> 基础功能 · Cesium.js

## 实现思路

- Entity.polyline 传 `Cartesian3[]` 或 CallbackProperty，`width` + 自定义 MaterialProperty 做流动线/发光线。

- 拾取用 `ScreenSpaceEventHandler` + `scene.pick` / `pickPosition`，注意地形深度。

## 代码结构

- 初始化区域
- 功能操作区域
- 实体管理区域
- 图形绘制区域

## 独立函数

- `clearLineEntities()` — 移除 Entity / 解绑监听
- `calculateAndDisplayDistance()` — 经纬高 ↔ Cartesian3
- `updateRealTimeDistance()` — 经纬高 ↔ Cartesian3

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
     *
```

### 初始化区域

```js
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

/** 
 * 创建GUI控制面板
 * @type {dat.GUI}
 */
const gui = new GUI();

/** 
 * 全局事件处理器
 * @type {Cesium.ScreenSpaceEventHandler}
 */
let globalHandler = null;
```

### 功能操作区域

```js
/** 
 * 定义图形绘制操作对象
 * @namespace obj
 */
const obj = {
    /** 
     * 绘制线功能
     * @function
     * @memberof obj
     */
    '绘制线': () => {
        clearLineEntities();
        initLineDrawing();
    },
};

// 将操作对象添加到GUI控制面板
for (const key in obj) gui.add(obj, key)
```

