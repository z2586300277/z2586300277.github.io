---
title: "键盘控制飞行 - Cesium.js 案例讲解"
description: "Cesium 多技术组合的应用 demo。主流程在 `showInstructions`、`startFirstRoam`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,键盘控制飞行"
outline: deep
---

# 键盘控制飞行

*controlModel*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=controlModel)


![键盘控制飞行](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/application/controlModel.jpg)


## 效果说明

Cesium 多技术组合的应用 demo。主流程在 `showInstructions`、`startFirstRoam`。

> 应用相关 · Cesium.js

## 代码结构

- 配置区域
- 状态管理
- 初始化区域
- GUI控制

## 独立函数

- `startFirstRoam()` — 经纬高 ↔ Cartesian3
- `changeRoamView()` — 移除 Entity / 解绑监听
- `stopFirstRoam()` — 移除 Entity / 解绑监听
- `quitFirstRoam()` — 移除 Entity / 解绑监听

## 源码

```js
import * as Cesium from "cesium";
import { GUI } from 'dat.gui';
```

### 配置区域

```js
/**
 * 模型姿态控制对象，用于控制模型的偏航角(heading)、俯仰角(pitch)和翻滚角(roll)
 * @type {Cesium.HeadingPitchRoll}
 */
let headingPitchRoll = new Cesium.HeadingPitchRoll();

/**
 * 局部变换坐标系生成器，用于创建局部坐标系到世界坐标系的变换
 * "north"表示Y轴指向北，"west"表示X轴指向西
 * @type {Function}
 */
let fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator("north", "west");

/**
 * 每次姿态变化角度(4°)，将角度转换为弧度用于计算
 * @type {Number}
 */
let deltaRadians = Cesium.Math.toRadians(4);

/**
 * 速度向量，用于存储模型移动的方向和速度
 * @type {Cesium.Cartesian3}
 */
let Vector = new Cesium.Cartesian3();
```

### 状态管理

```js
/**
 * 视角控制状态，可以是"first"(第一人称)、"god"(上帝视角)或"none"(无控制)
 * @type {String}
 */
let view = "first";

/**
 * 模型实例(用于防止重复添加)
 * @type {Object}
 */
let firstModel = "";

/**
 * 模型当前位置，使用笛卡尔坐标表示
 * @type {Cesium.Cartesian3}
 */
let position;

/**
 * 模型运动速度
 * @type {Number}
 */
let speed = 5;

/**
 * 相机相对模型的位置向量，用于确定相机相对于模型的位置
 * @type {Array}
 */
let xyz = [0, 0, 50];

/**
 * 第一人称视角相机位置 [x, y, z]
 * @type {Array}
 */
let firstRoamXYZ = [0, -50, 10];

/**
 * 上帝视角相机位置 [x, y, z]
 * @type {Array}
 */
let godRoamXYZ = [0, 0, 50];

/**
 * 键盘事件处理函数引用，用于后续移除事件监听器
 * @type {Function}
 */
let firstDown;

/**
 * 场景更新前事件处理函数引用，用于后续移除事件监听器
 * @type {Function}
 */
let preUpdate;
```

