---
title: "CSS元素 - Three.js 案例讲解"
description: "CSS2DRenderer / CSS3DRenderer 与 WebGL 同屏渲染 HTML 标签"
head:
  - - meta
    - name: keywords
      content: "three.js,CSS2D,CSS3D,CSS2DObject,HTML标签"
outline: deep
---

# CSS 元素

*CSS2D / CSS3D*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cssElement)

## 你将学到什么

- **CSS2DObject** — DOM 始终面向相机（billboard 标签）
- **CSS3DObject** — DOM 参与 3D 变换（可旋转进场景）
- 三渲染器同帧：`WebGLRenderer` + `css2DRender` + `css3DRender`

## 效果说明

5 组标签沿 Z / Y 排列：**2D 标签** 平贴屏幕方向，**3D 标签** 缩小后立在场景中，可看出透视差异。

## 核心概念

```js
// 每帧必须三个都 render
renderer.render(scene, camera);
css3DRender.render(scene, camera);
css2DRender.render(scene, camera);
```

CSS 层叠在 WebGL canvas 之上，通过 `position:relative; top:-height` 与 canvas 对齐。`pointerEvents: 'none'` 避免挡住 WebGL 操作（2D 标签可单独 `auto` 接收点击）。

对比 [screenCoord](/examples/three/basic/screenCoord) 手算投影，本方案由引擎处理矩阵。

## 小结

- 2D 标牌 → CSS2D；3D 面板 → CSS3D + scale
- 上一篇：[模型视图](/examples/three/basic/modelView) · 下一篇：[DOM遮挡](/examples/three/basic/domDisplay)

> 基础案例 · Three.js · 22/35
