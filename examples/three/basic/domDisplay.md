---
title: "DOM遮挡 - Three.js 案例讲解"
description: "Raycaster 检测 CSS3D 标签与 Mesh 之间遮挡，动态 opacity"
head:
  - - meta
    - name: keywords
      content: "three.js,DOM遮挡,CSS3D,Raycaster,深度"
outline: deep
---

# DOM 遮挡

*DOM Occlusion*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=domDisplay)

## 你将学到什么

- CSS3D 标签被 **3D 物体挡住** 时隐藏（opacity=0）
- 相机 → 标签方向 **Raycaster** 检测中间 Mesh
- 100 个 CSS3D 标签 + 随机 TorusKnot 障碍

## 效果说明

大量「顽皮宝」DOM 标签散布在场景；当 **结形体** 挡在相机与标签之间时，标签淡出，模拟真实遮挡。

## 核心概念

```js
function createRender(mesh) {
    const direction = new THREE.Vector3()
        .subVectors(mesh.position, camera.position).normalize();
    const raycaster = new THREE.Raycaster(
        camera.position, direction, 0,
        mesh.position.distanceTo(camera.position)
    );
    const hits = raycaster.intersectObjects(meshs);
    mesh.div.style.opacity = hits.length > 0 ? 0 : 1;
}
```

射线长度 = 相机到标签距离，只检测 **之间** 的物体，不检测标签后方。

## 小结

- CSS3D 无自动深度遮挡，需 **手动 raycast**
- 上一篇：[CSS元素](/examples/three/basic/cssElement) · 下一篇：[相机动画](/examples/three/basic/cameraAnimate)

> 基础案例 · Three.js · 23/35
