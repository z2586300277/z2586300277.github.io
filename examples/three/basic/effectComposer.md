---
title: "渲染器配置 - Three.js 案例讲解"
description: "toneMapping、outputColorSpace、OutputPass 与 effect/normal 双路渲染对比"
head:
  - - meta
    - name: keywords
      content: "three.js,渲染器,toneMapping,OutputPass,RoomEnvironment"
outline: deep
---

# 渲染器配置

*Renderer Config*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=effectComposer)

## 你将学到什么

- **toneMapping** 系列：Linear / Reinhard / ACESFilmic / AgX …
- **outputColorSpace** SRGB vs Linear
- **RoomEnvironment** + PMREM 快速 IBL
- GUI 切换 **effect / normal / both** 渲染路径

## 效果说明

LittlestTokyo 模型 + 室内环境光。调节曝光、色调映射，对比 **直接 renderer.render** 与 **composer+OutputPass** 成片差异。

## 核心概念

```js
scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// OutputPass 做输出色彩空间最终转换
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new OutputPass());
```

现代 Three.js **物理正确输出** 应走 OutputPass 或等价配置。

## 小结

- 上一篇：[多轮廓光](/examples/three/basic/multOutlinePass) · 下一篇：[模型导出](/examples/three/basic/modelExport)

> 基础案例 · Three.js · 32/35
