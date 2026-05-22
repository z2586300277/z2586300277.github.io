---
title: "场景剪切-后处理 - Three.js 案例讲解"
description: "setScissor 分屏对比：无 Bloom vs UnrealBloomPass，滑块拖动分界线"
head:
  - - meta
    - name: keywords
      content: "three.js,Scissor,Bloom,分屏对比,EffectComposer"
outline: deep
---

# 场景剪切 - 后处理

*Scissor Compare*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=sceneScissor)

## 你将学到什么

- **renderer.setScissor** 分区渲染
- 左右屏 **两个 EffectComposer** 对比效果
- 可拖动滑块调整分界位置

## 效果说明

100 个随机立方体。左侧 **无辉光**，右侧 **UnrealBloomPass**，中间竖线可拖拽，类似 PS 对比滑块。

## 核心概念

```js
renderer.setScissorTest(true);
renderer.setScissor(0, 0, splitX, height);
composer_original.render();

renderer.setScissor(splitX, 0, width - splitX, height);
composer_bloom.render();
renderer.setScissorTest(false);
```

同一 scene/camera，不同 composer 输出到 canvas 不同区域。

## 小结

- 上一篇：[RenderTarget](/examples/three/basic/renderTarget) · 下一篇：[多轮廓光](/examples/three/basic/multOutlinePass)

> 基础案例 · Three.js · 30/35
