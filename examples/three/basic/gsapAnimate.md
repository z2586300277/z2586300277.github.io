---
title: "GSAP动画 - Three.js 案例讲解"
description: "gsap.to 驱动 camera.position 与 controls.target 相机动画"
head:
  - - meta
    - name: keywords
      content: "three.js,gsap,相机动画,controls.target"
outline: deep
---

# GSAP 动画

*GSAP Camera*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=gsapAnimate)

![GSAP动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/gsapAnimate.jpg)

## 你将学到什么

- **gsap.to** 对 Vector3 的 x/y/z 插值
- 同时动画 **camera.position** 与 **controls.target**
- 与 OrbitControls 配合的 **运镜** 思路

## 效果说明

点击 GUI「播放」，相机从 (0,30,30) **2 秒内** 飞到 (20,20,20)，观察中心 target 移到 (-5,2,1)，形成平滑运镜。

## 核心概念

```js
function createGsapAnimation(position, targetPos) {
    return gsap.to(position, {
        ...targetPos,
        duration: 2,
        ease: 'none',
    });
}

// 同时动相机与轨道中心
createGsapAnimation(camera.position, { x: 20, y: 20, z: 20 });
createGsapAnimation(controls.target, { x: -5, y: 2, z: 1 });
```

rAF 里仍需 `controls.update()`（尤其 enableDamping 时）。

## 小结

- 运镜 = gsap(camera.position) + gsap(controls.target)
- 更多见 [动画目录](/examples/three/animation/gsapBasic)
- 上一篇：[多模型动画](/examples/three/basic/modelAnimates) · 下一篇：[精灵标签](/examples/three/basic/spriteTexture)

> 基础案例 · Three.js · 19/35
