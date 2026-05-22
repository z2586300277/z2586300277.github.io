---
title: "div元素绘制 - Cesium.js 案例讲解"
description: "场景粒子（雨雪等），挂在 viewer.scene 或 Entity 上。"
head:
  - - meta
    - name: keywords
      content: "cesium.js,webgl,basic,div元素绘制"
outline: deep
---
# div元素绘制

*drawDivElement*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=drawDivElement)

![div元素绘制](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/drawDivElement.jpg)

## 你将学到什么

- Cesium Viewer 初始化
- Cesium 影像图层

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

- **`updateTrackInfoPosition()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as Cesium from 'cesium'
const box = document.getElementById('box')
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
    destination: Cesium.Cartesian3.fromDegrees(118, 37, 1000), // 目标位置
    duration: 0  // 飞行时间（秒）
})
// ==================== 弹窗元素创建区域 ====================
const trackInfoElement = document.createElement('div')
// 设置弹窗样式：白底黑字，带阴影和圆角
Object.assign(trackInfoElement.style, {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 白色半透明背景
    color: 'black', // 黑色文字
    padding: '8px 12px', // 内边距
    borderRadius: '6px', // 圆角
    fontWeight: 'bold', // 粗体文字
    fontSize: '14px', // 字体大小
    position: 'absolute',
    textAlign: 'center',
    maxWidth: '100px' // 最小宽度
})
// 将弹窗元素添加到CSS容器中
box.appendChild(trackInfoElement)
// 监听场景更新事件
viewer.scene.preUpdate.addEventListener(updateTrackInfoPosition)
// ==================== 弹窗更新逻辑区域 ====================
function updateTrackInfoPosition() {
    // 将地球上的三维位置转换为屏幕坐标
    const windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(
        viewer.scene,      // 场景对象
        Cesium.Cartesian3.fromDegrees(118, 37, 1)    // 世界坐标
    )
    // 如果坐标转换成功，更新弹窗位置和内容
    if (windowCoord) {
        // 设置弹窗在屏幕上的位置
        trackInfoElement.style.left = windowCoord.x + 'px'
        trackInfoElement.style.top = windowCoord.y + 'px'
        trackInfoElement.style.display = 'block'
        // 更新弹窗内容，显示实时位置信息
        trackInfoElement.innerHTML = '你们瞎搞'
    } else {
        // 坐标转换失败时隐藏弹窗
        trackInfoElement.style.display = 'none'
    }
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=drawDivElement) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础功能目录](/examples/cesium/basic/)

> 基础功能 · Cesium.js
