---
title: "计算方位角 - Cesium.js 案例讲解"
description: "Cesium 地球上的可视化效果。主流程在 `initLineDrawing`、`updateRealTimeAngle`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,计算方位角"
outline: deep
---

# 计算方位角

*computerAngle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=tools&id=computerAngle)


![计算方位角](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/tools/computerAngle.jpg)


## 效果说明

Cesium 地球上的可视化效果。主流程在 `initLineDrawing`、`updateRealTimeAngle`。

> 相关工具 · Cesium.js

## 实现思路

- Entity.polyline 传 `Cartesian3[]` 或 CallbackProperty，`width` + 自定义 MaterialProperty 做流动线/发光线。

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

- 局部 ENU → 世界坐标：`Transforms.eastNorthUpToFixedFrame`，雷达/箭头类特效常用。

- 拾取用 `ScreenSpaceEventHandler` + `scene.pick` / `pickPosition`，注意地形深度。

## 代码结构

- 导入模块和初始化
- GUI控制面板
- Cesium Viewer初始化
- 状态管理

## 独立函数

- `initLineDrawing()` — 移除 Entity / 解绑监听
- `updateRealTimeAngle()` — 经纬高 ↔ Cartesian3

## 源码

```js
/**
 * Cesium角度计算与线段绘制工具
 * 本工具提供交互式线段绘制功能，可以绘制线段并实时计算线段的角度信息
 * 
 * 功能说明：
 * 1. 用户点击"绘制线段"按钮开始交互式绘制
 * 2. 在地图上点击选择线段起点
 * 3. 移动鼠标实时显示临时线段和角度信息
 * 4. 点击第二个点确定线段终点，完成绘制
 * 5. 右键点击结束绘制模式
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
   * 绘制线段功能 - 启动交互式线段绘制模式
   * @function
   * @memberof obj
   */
  '绘制线段': () => {
    initLineDrawing()
  },
};

// 创建GUI控制面板并添加操作按钮
const gui = new GUI();
for (const key in obj) gui.add(obj, key)
```

