---
title: "视图辅助 - Three.js 案例讲解"
description: "ViewHelper 右下角坐标轴小部件，autoClear 叠加渲染"
head:
  - - meta
    - name: keywords
      content: "three.js,ViewHelper,视图辅助,坐标轴"
outline: deep
---

# 视图辅助

*View Helper*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=viewHelper)

## 你将学到什么

- **ViewHelper** 右下角 orientation gizmo
- `renderer.autoClear = false` 叠加绘制
- 主场景 render 后再 `viewHelper.render(renderer)`

## 效果说明

网格场景右下角显示 **XYZ 方向小控件**，点击可快速切换标准视角（Three.js r152+ ViewHelper 内置交互）。

## 核心概念

```js
renderer.autoClear = false;
const viewHelper = new ViewHelper(camera, renderer.domElement);

function animate() {
    controls.update();
    renderer.render(scene, camera);
    viewHelper.render(renderer);  // 叠在小角落
    requestAnimationFrame(animate);
}
```

编辑器、Blender 式视口方向指示同款思路。

## 小结

- 上一篇：[骨骼动画](/examples/three/basic/skeletonBone) · 下一篇：[帧率控制](/examples/three/basic/renderFrame)

> 基础案例 · Three.js · 27/35
