---
title: "模型视图 - Three.js 案例讲解"
description: "Box3 包围盒计算六向标准视图相机位置，gsap 切换前/右/顶视图"
head:
  - - meta
    - name: keywords
      content: "three.js,视图,Box3,前视图,gsap,OrbitControls"
outline: deep
---

# 模型视图

*Model Views*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelView)

![模型视图](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/modelView.jpg)

## 你将学到什么

- 用 **Box3 + FOV** 反算「刚好框住模型」的相机距离
- 绕 Y/X 轴旋转 **观察方向** 得到六视图位置
- gsap 切换 **camera.position** 与 **controls.target**

## 效果说明

加载电脑模型，GUI 按钮 **前视图 / 右视图 / 上视图**，相机平滑飞到对应标准视角，target 始终为模型中心。

## 核心概念

```js
const box = new THREE.Box3().setFromObject(object);
const center = box.getCenter(new THREE.Vector3());
const radius = box.max.clone().sub(box.min).length() / 2;

// 距离 = 半径 / tan(fov/2)
const distance = radius / Math.tan(Math.PI * fov / 360);
const dir = object.getWorldDirection(new THREE.Vector3());
const frontView = dir.clone().multiplyScalar(distance).add(center);

// 右视图：方向绕 Y 转 90°
const rightView = dir.clone()
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
    .add(center);
```

这是 CAD/编辑器 **「正视图」「俯视图」** 按钮的常用算法。

## 小结

- 标准视图 = 包围球 + 方向向量旋转 + gsap 运镜
- 上一篇：[精灵标签](/examples/three/basic/spriteTexture) · 下一篇：[CSS元素](/examples/three/basic/cssElement)

> 基础案例 · Three.js · 21/35
