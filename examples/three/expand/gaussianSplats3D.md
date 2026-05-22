---
title: "高斯溅射 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,expand,高斯溅射"
outline: deep
---
# 高斯溅射

*gaussianSplats3D*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=gaussianSplats3D)

![高斯溅射](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/gaussianSplats3D.webp)

## 你将学到什么

- Three.js/Cesium 场景搭建
- 案例核心 API 用法
- 在线编辑器调试技巧

## 效果说明

Three.js 接第三方库或扩展能力。

> 扩展功能 · Three.js

## 核心概念

- **Scene / Camera / Renderer** 是 Three.js 渲染三件套；Mesh = Geometry + Material。
- 开发时先确认坐标系、材质是否受光、以及是否需要 rAF 循环。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 渲染场景并处理 resize

## 源码

```js
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d'

/**
 * 参考引用自  https://github.com/mkkellogg/GaussianSplats3D
 * 可结合Three.js 融合 更多玩法参考源文档
 * @type {GaussianSplats3D.Viewer}
 */

// 修改初始化配置
const viewer = new GaussianSplats3D.Viewer({
    'useSharedArrayBuffer': false,
    'useBuiltInControls': true,
    'sharedMemoryForWorkers':false,
    'cameraUp': [0, -1, -0.6],
    'initialCameraPosition': [-1, -4, 6],
    'initialCameraLookAt': [0, 4, 0]
});
//使用私有对象存储带宽较低耐心等待一下 http://app.foxicle.xyz:9000/public-bucket/model/3dgs/garden.ksplat
viewer.addSplatScene(FILE_HOST + 'other/deskFlower.ksplat', {
    'splatAlphaRemovalThreshold': 5,
    'showLoadingUI': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
}).then(() => {
    viewer.start()
});
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=gaussianSplats3D) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/three/expand/)

> 扩展功能 · Three.js
