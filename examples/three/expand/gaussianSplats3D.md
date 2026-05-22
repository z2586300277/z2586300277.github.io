---
title: "高斯溅射 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,高斯溅射,扩展功能"
outline: deep
---

# 高斯溅射

*gaussianSplats3D*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=gaussianSplats3D)


![高斯溅射](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/gaussianSplats3D.webp)


## 效果说明

Three.js 接第三方库或扩展能力。

> 扩展功能 · Three.js

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

