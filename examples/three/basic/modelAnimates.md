---
title: "单/多模型动画 - Three.js 案例讲解"
description: "多 AnimationMixer 并行、actionIndexs 开关与多 clip 同时 play"
head:
  - - meta
    - name: keywords
      content: "three.js,多动画,AnimationMixer,clipAction,并行播放"
outline: deep
---

# 单/多模型动画

*Multi Clip Animation*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelAnimates)

![单/多模型动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/modelAnimates.jpg)

## 你将学到什么

- 同一模型 **多个 clip 切换** 与 **多 clip 同时播放**
- `actionIndexs` 布尔数组控制播放哪些动画
- 多个模型各自 **mixerAnimateRender** 挂到统一 rAF

## 效果说明

Soldier 模型，dat.GUI 按钮：**单动画 0/1/2…** 切换单个动作；**1,2 动画同时播放** 让两个 clip 并行 4 秒后 stop。

## 核心概念

与 [modelAnimation](/examples/three/basic/modelAnimation) 的 crossFade 不同，本案例用 **多 Action 同时 play + 权重默认混合**：

```js
const actions = group.actionIndexs.map((enabled, k) => {
    if (!enabled) return;
    const action = mixer.clipAction(group.animations[k]);
    action.loop = THREE.LoopRepeat;
    action.play();
    return action;
}).filter(Boolean);
```

`mixerFrames` 数组收集各模型的 `mixerAnimateRender`，在 animate 里统一 `forEach` 更新。

## 小结

- 多动画并行 = 多个 clipAction 同时 play（注意骨骼冲突）
- 平滑切换仍推荐 crossFadeTo → 见 modelAnimation
- 上一篇：[Box3](/examples/three/basic/transformBox3) · 下一篇：[GSAP动画](/examples/three/basic/gsapAnimate)

> 基础案例 · Three.js · 18/35
