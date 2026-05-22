---
title: "键盘控制相机 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,键盘控制相机"
outline: deep
---
# 键盘控制相机

*KeyboardRoam*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=keyboardRoam)

![键盘控制相机](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/keyboardRoam.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层
- GUI 面板调试参数

## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。

> 基础功能 · Cesium.js

## 核心概念

- **Viewer** 封装地球、相机、图层；可关闭 animation/timeline 等 UI 精简界面。

- **ImageryLayer** 叠加 XYZ/WMTS/ArcGIS 等底图，`imageryLayers.add/remove` 管理。

## 实现步骤

1. 初始化 `Cesium.Viewer` 与底图图层
2. 添加 Entity / Primitive / DataSource 等业务对象
3. 按需 `camera.flyTo` 定位视角

## 代码要点

- **`startKeyboardRoam()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`hprSetting()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`getFlagFromKeyboard()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`quitKeyboardRoam()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from "cesium";
import { GUI } from 'dat.gui';

// 获取用于渲染Cesium场景的容器元素
const box = document.getElementById('box')

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

// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";

/** 
 * 创建GUI控制面板
 * @type {dat.GUI}
 */
const gui = new GUI();
// 添加瓦片坐标信息
viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider());

// ==================== 状态管理区域 ====================
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

// ==================== GUI控制区域 ====================
/** 
 * 定义键盘漫游操作对象
 * @namespace keyboardRoamObj
 */
const keyboardRoamObj = {
  '启动键盘漫游': () => {
    if (viewer) {
      startKeyboardRoam(1);
    }
  },
  '停止键盘漫游': () => {
    quitKeyboardRoam();
  },
  '重置视角': () => {
    // 重置相机到默认视角
    viewer.camera.flyHome(1);
  },
  '使用说明': () => {
    const instructions = `
键盘控制说明:
====================
相机姿态控制 (WASDQE):
  W : 向上俯仰视角
  S : 向下俯仰视角
  A : 向左偏航视角
  D : 向右偏航视角
  Q : 向左翻滚视角
  E : 向右翻滚视角
相机位置移动 (IJKLUO):
  I : 向前移动相机
  K : 向后移动相机
  J : 向左移动相机
  L : 向右移动相机
  U : 向上移动相机
  O : 向下移动相机
观察方向控制 (数字键1234):
  1 : 向上观察
  2 : 向下观察
  3 : 向左观察
  4 : 向右观察
地球自转控制 (方向键):
  ↑ : 地球向北自转
  ↓ : 地球向南自转
  ← : 地球向西自转
  → : 地球向东自转
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=keyboardRoam) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
