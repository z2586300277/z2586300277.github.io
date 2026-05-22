---
title: "帧率控制 - Three.js 案例讲解"
description: "固定 FPS 渲染：Clock 累加 delta，到 renderT 才 render"
head:
  - - meta
    - name: keywords
      content: "three.js,帧率限制,FPS,Clock,Stats"
outline: deep
---

# 帧率控制

*Fixed FPS*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=renderFrame)

## 你将学到什么

- **限制最高 FPS** 降低 GPU 占用（笔记本省电、后台标签页）
- rAF 仍每帧调用，但 **按需 render**
- Stats 监视实际渲染次数

## 效果说明

大场景 build3.glb + GUI 调节目标 fps（1~300）。`renderT = 1/fps`，仅当 `timeS > renderT` 时才 `renderer.render`。

## 核心概念

```js
let timeS = 0, fps = 60, renderT = 1 / fps;

function animate() {
    timeS += clock.getDelta();
    if (timeS > renderT) {
        controls.update();
        stats.update();
        renderer.render(scene, camera);
        timeS = 0;
    }
    requestAnimationFrame(animate);
}
```

与 [入门·帧率](/examples/three/introduction/帧率)（Stats 监视）互补：本篇是 **主动限帧**。

## 小结

- 上一篇：[视图辅助](/examples/three/basic/viewHelper) · 下一篇：[渲染贴图物体](/examples/three/basic/renderTarget)

> 基础案例 · Three.js · 28/35
