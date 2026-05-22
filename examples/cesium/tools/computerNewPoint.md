---
title: "计算新坐标 - Cesium.js 案例讲解"
description: "Cesium 地球上的可视化效果。主流程在 `setupInteractiveDrawing`、`drawPointOnMap`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,计算新坐标"
outline: deep
---

# 计算新坐标

*computerNewPoint*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=tools&id=computerNewPoint)


![计算新坐标](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/tools/computerNewPoint.jpg)


## 效果说明

Cesium 地球上的可视化效果。主流程在 `setupInteractiveDrawing`、`drawPointOnMap`。

> 相关工具 · Cesium.js

## 实现思路

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

- 拾取用 `ScreenSpaceEventHandler` + `scene.pick` / `pickPosition`，注意地形深度。

## 代码结构

- 导入模块和初始化
- GUI控制面板
- Cesium Viewer初始化
- 状态管理

## 独立函数

- `setupInteractiveDrawing()` — 移除 Entity / 解绑监听
- `drawPointOnMap()` — 经纬高 ↔ Cartesian3

## 源码

```js
/**
 * Cesium点位计算与绘制工具
 * 本工具提供交互式点位绘制功能，可以根据起始点、方位角和距离计算新点位坐标并绘制在地图上
 * 使用球面三角学算法保证计算精度
 * 
 * 功能说明：
 * 1. 用户点击"绘制原始点"按钮开始交互式绘制
 * 2. 在地图上点击选择起始点
 * 3. 输入方位角和距离参数
 * 4. 系统自动计算并绘制终点
 * 5. 调整视角以完整显示两个点
 */
```

### 导入模块和初始化

```js
import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'

// 获取地图容器元素
const box = document.getElementById('box')
```

### GUI控制面板

```js
/** 
 * 定义图形绘制操作对象
 * @namespace obj
 */
const obj = {
  /** 
   * 绘制原始点功能 - 启动交互式绘制模式
   * @function
   * @memberof obj
   */
  '绘制原始点': () => {
    setupInteractiveDrawing()
  },
};

// 创建GUI控制面板并添加操作按钮
const gui = new GUI();
for (const key in obj) gui.add(obj, key)
```

