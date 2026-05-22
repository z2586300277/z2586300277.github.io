---
title: "cesium后期处理 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `clearAll`、`applyFilter`。"
head:
  - - meta
    - name: keywords
      content: "后期处理"
outline: deep
---

# cesium后期处理

*postProcessStage*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=singleEffect&id=postProcessStage)


![cesium后期处理](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/effect/postProcessStage.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `clearAll`、`applyFilter`。

> 单一效果 · Cesium.js

## 实现思路

- Entity.model 加载 glTF/glb，`minimumPixelSize` 保证远距离仍可见。

- 屏幕空间后期：`PostProcessStage` 或 `PostProcessStageLibrary` 里的 bloom、雨雪等全屏 Pass。

## 代码结构

- GUI控制

## 独立函数

- `clearAll()` — 移除 Entity / 解绑监听

## 源码

```js
import * as Cesium from 'cesium'
import { GUI } from 'dat.gui';

/**
 * Cesium后处理阶段示例
 * 该示例演示了如何使用Cesium的后处理效果来增强场景视觉效果
 * 包括FXAA、Bloom、SSAO、模糊、黑白、夜视、描边、景深和运动模糊等效果
 */

// 获取Cesium容器元素
const box = document.getElementById('box')

// 初始化Cesium Viewer
const viewer = new Cesium.Viewer(box, {
    // 禁用动画控件（左下角仪表）
    animation: false,
    // 禁用图层选择器（右上角图层选择按钮）
    baseLayerPicker: false,
    // 设置基础影像图层为ArcGIS影像服务
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    // 禁用全屏按钮（右下角全屏选择按钮）
    fullscreenButton: false,
    // 禁用时间轴控件
    timeline: false,
    // 禁用信息框
    infoBox: false,
})

// 启用地形深度检测，使墙体能够贴合地形
viewer.scene.globe.depthTestAgainstTerrain = true
// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";

// 获取后处理阶段集合
const stages = viewer.scene.postProcessStages;
let myentity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.5, 34.5, 0),
    model: {
        uri: HOST + '/files/model/car.glb',
        minimumPixelSize: 100,
        maximumScale: 300
    }
})
viewer.zoomTo(myentity)
/**
 * 清空所有特效
 * 禁用内置特效并移除所有自定义后处理阶段
 */
function clearAll() {
    // 禁用内置的FXAA抗锯齿效果
    stages.fxaa.enabled = false;
    // 禁用内置的Bloom辉光效果
    stages.bloom.enabled = fa
```

### GUI控制

```js
/** 
 * 定义图形绘制操作对象
 * 包含各种滤镜效果的触发函数
 * @namespace obj
 */
const obj = {
    '无滤镜': () => {
        applyFilter('none');
    },
    'FXAA': () => {
        applyFilter('fxaa');
    },
    'Bloom': () => {
        applyFilter('bloom');
    },
    'SSAO': () => {
        applyFilter('ssao');
    },
    'Blur': () => {
        applyFilter('blur');
    },
    '黑白': () => {
        applyFilter('bw');
    },
    '夜视': () => {
        applyFilter('nv');
    },
    '描边': () => {
        applyFilter('sil');
    },
    '景深': () => {
        applyFilter('dof');
    },
    '运动模糊': () => {
        applyFilter('mb');
    }
};

/** 
 * 创建GUI控制面板
 * @type {dat.GUI}
 */
const gui = new GUI();
// 将操作对象添加到GUI控制面板
for (const key in obj) gui.add(obj, key)

// 默认应用无滤镜效果
applyFilter('none');
```

