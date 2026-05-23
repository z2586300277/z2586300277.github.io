---
title: "拖拽控制 - Three.js 案例讲解"
description: "TransformControls 平移/旋转/缩放，与 OrbitControls 互斥拖拽"
head:
  - - meta
    - name: keywords
      content: "three.js,TransformControls,拖拽,translate,rotate,scale"
outline: deep
---

# 拖拽控制

*Transform Controls*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=transformObject)

![拖拽控制](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/transformObject.jpg)

## 你将学到什么

- **TransformControls** 三种模式 translate / rotate / scale
- `attach(object)` 绑定要操控的 Object3D
- 拖拽时 **禁用 OrbitControls** 避免冲突

## 效果说明

GUI 可切换模式，并将控制器 **attach** 到 Fox 模型、平行光或地面平面，拖拽 gizmo 实时变换对象。

## 核心概念

```js
const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls.getHelper());

transformControls.addEventListener('dragging-changed', event => {
    controls.enabled = !event.value;  // 拖拽中关掉轨道控制
});

folder.add(transformControls, 'mode', ['translate', 'rotate', 'scale']);
transformControls.attach(model);
```

| 模式 | 快捷键（默认） | 作用 |
|------|---------------|------|
| translate | W | 平移 |
| rotate | E | 旋转 |
| scale | R | 缩放 |

## 小结

- 编辑器式交互 = TransformControls + OrbitControls 互斥
- 上一篇：[材质修改](/examples/three/basic/changeMaterial) · 下一篇：[变换 Box3](/examples/three/basic/transformBox3)

> 基础案例 · Three.js · 16/35
