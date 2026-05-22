---
title: "键盘控制相机 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `startKeyboardRoam`、`hprSetting`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,键盘控制相机"
outline: deep
---

# 键盘控制相机

*KeyboardRoam*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=keyboardRoam)


![键盘控制相机](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/keyboardRoam.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `startKeyboardRoam`、`hprSetting`。

> 基础功能 · Cesium.js

## 实现思路

- `viewer.clock.onTick` 做逐帧逻辑：改 heading、刷新采样区间、或判断 `JulianDate.compare` 是否到终点后循环。

- 底图换 `ImageryProvider`：XYZ 模板、WMTS、ArcGIS 等，挂到 `viewer.imageryLayers`。

## 代码结构

- 初始化区域
- 状态管理区域
- GUI控制区域
- 功能操作区域

## 独立函数

- `quitKeyboardRoam()` — 到终点后重设时间区间，循环飞

## 源码

```js
import * as Cesium from "cesium";
import { GUI } from 'dat.gui';

// 获取用于渲染Cesium场景的容器元素
const box = document.getElementById('box')
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

// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";

/** 
 * 创建GUI控制面板
 * @type {dat.GUI}
 */
const gui = new GUI();
// 添加瓦片坐标信息
viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider());
```

### 状态管理区域

```js
// 定义事件组 - 用于跟踪键盘按键状态
let flags = {
  // 相机姿态控制相关标志
  pitchUp: false,      // 俯仰角向上
  pitchDown: false,    // 俯仰角向下
  rollLeft: false,     // 翻滚角向左
  rollRight: false,    // 翻滚角向右
  headingLeft: false,  // 偏航角向左
  headingRight: false, // 偏航角向右

  // 相机位置移动相关标志
  moveForward: false,  // 相机自身向前平移
  moveBackward: false, // 相机自身向后平移
  moveLeft: false,     // 相机自身向左平移
  moveRight: false,    // 相机自身向右平移
  moveUp: false,       // 相机自身向上平移
  moveDown: false,     // 相机自身向下平移
  key1: false,         // 相机视角向上旋转
  key2: false,         // 相机视角向下旋转
  key3: false,         // 相机视角向左旋转
  key4: false,         // 相机视角向右旋转
  // 新增的控制标志
  arrowUp: false,      // 地球沿经度向北自转
  arrowDown: false,    // 地球沿经度向南自转
  arrowLeft: false,    // 地球沿纬度向东自转
  arrowRight: false,   // 地球沿纬度向西自转
};

// 相机相关变量
let cameraHeight;  // 相机高度
let heading;       // 相机偏航角
let pitch;         // 相机俯仰角
let roll;          // 相机翻滚角

// 事件处理器引用 - 用于后续移除事件监听器
let tickHandler;      // 帧更新事件处理器
let keyDownHandler;   // 键盘按下事件处理器
let keyUpHandler;     // 键盘释放事件处理器

// 启用地形深度测试，确保正确渲染
viewer.scene.globe.depthTestAgainstTerrain = true;
```

