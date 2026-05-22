---
title: "Cesium 3D 变换控制器 - Cesium.js 案例讲解"
description: "Cesium 地球上的可视化效果。主流程在 `getMountedObjectType`、`getMountedObjectName`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,transform controls,gizmo,模型变换,平移旋转缩放"
outline: deep
---

# Cesium 3D 变换控制器

*Cesium 3D Transform Controls*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=tools&id=transformControls)


![Cesium 3D 变换控制器](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/tools/transformControls.jpg)


## 效果说明

Cesium 地球上的可视化效果。主流程在 `getMountedObjectType`、`getMountedObjectName`。

> 相关工具 · Cesium.js

## 代码结构

- 导入模块
- Cesium Viewer 初始化
- 模型加载配置
- Gizmo 控制器初始化

## 独立函数

- `updateCoordinatesFromMatrix()` — 经纬高 ↔ Cartesian3

## 源码

```js
/**
 * Cesium Transform Controls - 模型变换控制器演示
 * 本案例演示了 cesium-transform-controls 插件的核心功能
 * 
 * 功能说明：
 * 1. 支持模型的平移（translate）、旋转（rotate）、缩放（scale）三种变换模式
 * 2. 支持局部坐标系（local）和地表坐标系（surface）两种坐标模式
 * 3. 支持对整个模型（Model）或模型子节点（ModelNode）进行变换操作
 * 4. 实时显示模型的位置、旋转角度和缩放信息
 * 
 * 依赖：
 * - cesium-transform-controls: https://github.com/123164867376464646/cesium-transform-controls
 * 
 * @author 123164867376464646
 */
```

### 导入模块

```js
import * as Cesium from 'cesium'
import { CoordinateMode, Gizmo, GizmoMode } from 'cesium-transform-controls'
import { GUI } from 'dat.gui'

console.log(Cesium.VERSION)
```

### Cesium Viewer 初始化

```js
/**
 * 初始化 Cesium Viewer 实例
 * @type {Cesium.Viewer}
 */

// 获取地图容器元素
const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
  baseLayerPicker: false,       // 不显示图层选择器
  geocoder: false,              // 不显示地理编码器
  homeButton: false,            // 不显示主页按钮
  sceneModePicker: false,       // 不显示场景模式选择器
  navigationHelpButton: false,  // 不显示导航帮助按钮
  animation: false,             // 不显示动画控件
  timeline: false,              // 不显示时间线
  infoBox: false,               // 不显示信息框
})
```

