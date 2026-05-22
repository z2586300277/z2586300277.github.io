---
title: "精灵标签 - Three.js 案例讲解"
description: "Canvas 绘制图文 → CanvasTexture → SpriteMaterial  billboard 标签"
head:
  - - meta
    - name: keywords
      content: "three.js,Sprite,CanvasTexture,精灵标签"
outline: deep
---

# 精灵标签

*Sprite Label*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=spriteTexture)

![精灵标签](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/spriteTexture.jpg)

## 你将学到什么

- **Canvas 2D** 动态画标签（图 + 字）
- **CanvasTexture** 转 Three.js 纹理
- `sprite.center` 锚点、`devicePixelRatio` 高清

## 效果说明

5 个 Sprite 沿对角线排列，每个显示 **头像 +「测试文本」**，纹理来自运行时 canvas 绘制。

## 核心概念

```js
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
// 高 DPI
canvas.width = logicalWidth * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);
ctx.drawImage(img, ...);
ctx.fillText(text, ...);

const texture = new THREE.CanvasTexture(canvas);
texture.colorSpace = THREE.SRGBColorSpace;

const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
sprite.center.set(0.5, 0);  // 底边中心锚点，适合「桩子上的牌」
```

改 canvas 内容后需 `texture.needsUpdate = true`。

## 小结

- 动态标签 = Canvas → CanvasTexture → Sprite
- 大量 DOM 标签见 [CSS元素](/examples/three/basic/cssElement)
- 上一篇：[GSAP](/examples/three/basic/gsapAnimate) · 下一篇：[模型视图](/examples/three/basic/modelView)

> 基础案例 · Three.js · 20/35
