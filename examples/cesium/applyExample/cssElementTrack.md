---
title: "div随轨迹运动 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `updateTrackInfoPosition`。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,div随轨迹运动"
outline: deep
---

# div随轨迹运动

*cssElementTrack*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=applyExample&id=cssElementTrack)


![div随轨迹运动](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/application/cssElementTrack.jpg)


## 效果说明

场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。主流程在 `updateTrackInfoPosition`。

> 应用相关 · Cesium.js

## 实现思路

- Entity.polyline 传 `Cartesian3[]` 或 CallbackProperty，`width` + 自定义 MaterialProperty 做流动线/发光线。

## 代码结构

- 初始化区域
- 弹窗元素创建区域
- 飞行轨迹数据区域
- 飞行器实体创建区域

## 源码

```js
import * as Cesium from 'cesium'
/**
 * Cesium飞行轨迹跟踪弹窗示例
 * 在飞行器沿轨迹移动时，显示一个跟随的弹窗显示当前位置信息
 */
```

### 初始化区域

```js
/** 
 * 获取Cesium容器元素
 * @type {HTMLElement}
 */
const box = document.getElementById('box')
/**
 * 初始化Cesium Viewer实例
 * @type {Cesium.Viewer}
 */
const viewer = new Cesium.Viewer(box, {
    animation: false, // 启用动画器件
    baseLayerPicker: false, // 是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),
    fullscreenButton: false, // 是否显示全屏按钮，右下角全屏选择按钮
    timeline: false, // 是否显示时间轴    
    infoBox: false, // 是否显示信息框   
})
// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";
// 启用地形深度测试，确保正确渲染
viewer.scene.globe.depthTestAgainstTerrain = false
/**
 * 设置相机初始视角
 * 将视角定位到飞行轨迹中心区域
 */
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(123, 34.32, 100000), // 目标位置
    duration: 0  // 飞行时间（秒）
})
```

### 弹窗元素创建区域

```js
/**
 * 创建CSS元素 - 跟踪信息弹窗
 * 用于显示飞行器的实时位置信息
 * @type {HTMLDivElement}
 */
const trackInfoElement = document.createElement('div')
// 设置弹窗样式：白底黑字，带阴影和圆角
Object.assign(trackInfoElement.style, {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 白色半透明背景
    color: 'black', // 黑色文字
    padding: '8px 12px', // 内边距
    borderRadius: '6px', // 圆角
    fontWeight: 'bold', // 粗体文字
    fontSize: '14px', // 字体大小
    fontFamily: 'Arial, sans-serif', // 字体族
    zIndex: 'auto',
    position: 'absolute',
    transform: 'translate(-50%, -110%)', // 使元素中心对齐定位点上方
    textAlign: 'center',
    minWidth: '150px' // 最小宽度
})
// 将弹窗元素添加到CSS容器中
box.appendChild(trackInfoElement)
```

