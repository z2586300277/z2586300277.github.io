---
title: "高斯溅射 - Three.js 案例讲解"
description: "高斯溅射：高斯溅射（扩展功能）"
head:
  - - meta
    - name: keywords
      content: "three.js,expand,gaussianSplats3D"
outline: deep
---

# 高斯溅射

*gaussianSplats3D*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=gaussianSplats3D)

![高斯溅射](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/gaussianSplats3D.jpg)

## 你将学到什么

- 本案例核心 API 与实现思路
- 对照源码与在线效果学习

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- 结合在线案例与下方源码阅读 GLSL / API 调用

## 实现步骤

1. 搭建灯光与环境（如有）
2. requestAnimationFrame 循环 update + render

## 代码要点

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
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/expand/gaussianSplats3D.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=gaussianSplats3D) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[柱状图](/examples/three/expand/barCharts)
- 下一篇：[高斯sparkjs](/examples/three/expand/sparkjs)

> 扩展功能 · Three.js · 15/19
