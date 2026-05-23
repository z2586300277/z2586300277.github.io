---
title: "相机动画 - Three.js 案例讲解"
description: "gsap 实现相机/ target 抖动、跳跃等运镜特效"
head:
  - - meta
    - name: keywords
      content: "three.js,相机动画,gsap,抖动,运镜"
outline: deep
---

# 相机动画

*Camera FX*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=cameraAnimate)

## 你将学到什么

- gsap **timeline repeat:-1** 无限抖动
- 可选择抖动 **camera.position** 或 **controls.target**
- 相机 + target **同步 Y 轴跳跃**

## 效果说明

导弹模型 + 天空盒背景。GUI：**目标抖动**（随机偏移 ±3）、**停止抖动**、**整体跳跃**（camera 与 target 同时 yoyo）。

## 核心概念

```js
shakeAnimation = gsap.timeline({ repeat: -1, yoyo: true });
shakeAnimation.to(c, {
    x: orig.x + (Math.random() - 0.5) * intensity,
    duration: 0.3,
    ease: 'power1.inOut'
});
// 停止：shakeAnimation.kill();
```

受击反馈、地震、手持摄影机效果常用此模式。

## 小结

- 上一篇：[DOM遮挡](/examples/three/basic/domDisplay) · 下一篇：[截图](/examples/three/basic/screenShot)

> 基础案例 · Three.js · 24/35
