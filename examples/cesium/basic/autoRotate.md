---
title: "自动旋转 - Cesium.js 案例讲解"
description: "clock.onTick + camera.rotate 绕地轴自动旋转地球"
head:
  - - meta
    - name: keywords
      content: "cesium.js,自动旋转,clock,onTick,camera.rotate"
outline: deep
---

# 自动旋转

*Auto Rotate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=autoRotate)

![自动旋转](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/autoRotate.jpg)

## 你将学到什么

- **viewer.clock.onTick** 每帧回调
- **camera.rotate(axis, angle)** 绕轴旋转
- 展览大屏「地球自动转」实现

## 效果说明

加载影像地球后，相机 **持续绕 Z 轴（UNIT_Z）** 旋转，类似展厅自动播放。

## 核心概念

```js
viewer.clock.onTick.addEventListener(() => {
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.01);
});
```

| 参数 | 含义 |
|------|------|
| `UNIT_Z` | 绕地心垂直轴转（经度方向环绕） |
| `0.01` | 弧度/ tick，越大越快 |

可在回调内加条件（鼠标交互时暂停等）。

与 OrbitControls 的 `autoRotate` 不同，这里是 **直接改 Cesium 相机**。

## 实现步骤

1. 初始化 Viewer，隐藏 credit 容器
2. `viewer.clock.onTick.addEventListener` 注册每帧回调
3. `camera.rotate(UNIT_Z, angle)` 持续绕地轴旋转
4. 可选：鼠标按下时跳过 rotate，实现「交互暂停」

## 源码

```js
import * as Cesium from 'cesium'

const viewer = new Cesium.Viewer(box, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())
    ),
    fullscreenButton: false,
    timeline: false,
    infoBox: false,
})

viewer._cesiumWidget._creditContainer.style.display = "none"

viewer.clock.onTick.addEventListener(() => {
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.01)
})
```

## 小结

- 上一篇：[记录视角](/examples/cesium/basic/cameraView) · 下一篇：[绘制文字](/examples/cesium/basic/cesiumText)

> 基础功能 · Cesium.js · 3/19
