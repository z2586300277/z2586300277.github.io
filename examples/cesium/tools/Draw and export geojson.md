---
title: "绘制图形并导出geojson - Cesium.js 案例讲解"
description: "Cesium 地球上的可视化效果。主流程在 `createPointMarker`、`createLine`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,绘制图形并导出geojson"
outline: deep
---

# 绘制图形并导出geojson

*Draw and export geojson*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=tools&id=Draw and export geojson)


![绘制图形并导出geojson](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/tools/DrawAndExportGeojson.jpg)


## 效果说明

Cesium 地球上的可视化效果。主流程在 `createPointMarker`、`createLine`。

> 相关工具 · Cesium.js

## 实现思路

- Entity.polyline 传 `Cartesian3[]` 或 CallbackProperty，`width` + 自定义 MaterialProperty 做流动线/发光线。

- 拾取用 `ScreenSpaceEventHandler` + `scene.pick` / `pickPosition`，注意地形深度。

## 代码结构

- 导入模块和初始化
- GUI控制面板
- Cesium Viewer初始化
- 全局变量定义

## 独立函数

- `createLine()` — 材质 / GLSL
- `createPolygon()` — 材质 / GLSL

## 源码

```js
/**
 * Cesium绘图并导出GeoJSON工具
 * 本工具提供交互式点、线、面绘制功能，并能导出为标准GeoJSON格式
 * 
 * 功能说明：
 * 1. 用户点击"绘制点/线/面"按钮开始交互式绘制
 * 2. 在地图上点击选择点位置
 * 3. 点击"导出为Geojson"按钮将绘制内容导出为GeoJSON文件
 * 
 * @module DrawAndExportGeojson
 * @author z2586300277
 * @version 1.0.0
 * @since 2024
 */
```

### 导入模块和初始化

```js
/**
 * 导入Cesium库，用于3D地球可视化和地理空间数据处理
 * @external Cesium
 * @see {@link https://cesium.com/}
 */
import * as Cesium from 'cesium'

/**
 * 导入dat.GUI库，用于创建轻量级的图形用户界面控制面板
 * @external GUI
 * @see {@link https://github.com/dataarts/dat.gui}
 */
import { GUI } from 'dat.gui'

/**
 * 获取HTML中用于挂载Cesium Viewer的地图容器元素
 * @type {HTMLElement}
 * @constant
 */
const box = document.getElementById('box')
```

### GUI控制面板

```js
/** 
 * 定义图形绘制操作对象，包含所有GUI控制面板的功能按钮
 * @namespace obj
 * @property {Function} '绘制点' - 启动交互式点绘制模式
 * @property {Function} '绘制线' - 启动交互式线绘制模式
 * @property {Function} '绘制面' - 启动交互式面绘制模式
 * @property {Function} '全部清除' - 清除所有已绘制的实体
 * @property {Function} '导出为Geojson' - 将绘制内容导出为GeoJSON格式文件
 */
const obj = {
    /** 
     * 绘制点功能 - 启动交互式点绘制模式
     * 当用户点击此按钮时，激活点绘制模式，允许用户在地图上点击添加点标记
     * @function
     * @memberof obj
     * @example
     * // 点击按钮后，用户可以在地图上点击添加点
     * // 每次点击都会创建一个新的点实体
     */
    '绘制点': () => {
        drawPoint()
    },
    /** 
     * 绘制线功能 - 启动交互式线绘制模式
     * 当用户点击此按钮时，激活线绘制模式，允许用户通过连续点击创建线段
     * @function
     * @memberof obj
     * @example
     * // 点击按钮后，用户可以通过连续点击创建折线
     * // 右键结束绘制操作
     */
    '绘制线': () => {
        drawLine()
    },
    /** 
     * 绘制面功能 - 启动交互式面绘制模式
     * 当用户点击此按钮时，激活面绘制模式，允许用户通过连续点击创建多边形
     * @function
     * @memberof obj
     * @example
     * // 点击按钮后，用户可以通过连续点击创建多边形
     * // 至少需要3个点才能形成面，右键结束绘制操作
     */
    '绘制面': () => {
        drawPlane()
    },
    /**
     * 全部清除功能 - 清除所有已绘制的实体
     * 移除地图上所有通过本工具创建的点、线、面等实体
     * @function
     * @memberof obj
     */
    '全部清除': () => {
        viewer.entities.removeAll();
    },
    /** 
     * 导出为Geojson功能 - 将绘制内容导出为GeoJSON格式文件
     * 将当前地图上所有绘制的实体转换为GeoJSON格式并提供下载
     * @function
     * @memberof obj
     * @examp
```

