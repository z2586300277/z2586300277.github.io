---
title: "三维转屏幕坐标 - Three.js 案例讲解"
description: "Vector3.project 将世界坐标转为屏幕像素，手动同步 DOM 标签位置"
head:
  - - meta
    - name: keywords
      content: "three.js,屏幕坐标,project,世界坐标,DOM标签"
outline: deep
---

# 三维转屏幕坐标

*World to Screen*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=screenCoord)

![三维转屏幕坐标](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/screenCoord.jpg)

## 你将学到什么

- **`vector.project(camera)`** 世界坐标 → NDC → 屏幕像素
- 不用 CSS2DRenderer 的 **手动 DOM 跟随** 写法
- 每帧在 rAF 里更新标签位置

## 效果说明

30 个小立方体，每个上方有一个 **绝对定位的 DOM**（图片 + 文字 D0~D29），随立方体在屏幕上移动而移动，像简易版 3D 标牌。

## 核心概念

### project 管线

```
世界坐标 (World)
    ↓ matrixWorld × projectionMatrix
NDC 归一化设备坐标 (-1 ~ 1)
    ↓ 视口变换
屏幕像素 (px)
```

```js
const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
worldPosition.project(camera);

const screenX = (worldPosition.x + 1) / 2 * width;
const screenY = (-worldPosition.y + 1) / 2 * height;

div.style.left = screenX + 'px';
div.style.top = screenY + 'px';
```

注意 **Y 轴翻转**：NDC 的 y 向上，屏幕 CSS 的 y 向下，故 `screenY` 取负。

### 与 CSS2DRenderer 对比

| 方式 | 本案例 | [cssElement](/examples/three/basic/cssElement) |
|------|--------|-----------------------------------------------|
| 实现 | 手算 project + DOM | CSS2DRenderer 自动投影 |
| 深度遮挡 | 无，DOM 总在最上层 | 可选 |
| 适用 | 理解原理、轻量标签 | 生产推荐 |

## 源码

```js
function updateCSS2DVisibility() {
    list.forEach(mesh => {
        const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
        worldPosition.project(camera);
        const width = renderer.domElement.clientWidth;
        const height = renderer.domElement.clientHeight;
        const screenX = (worldPosition.x + 1) / 2 * width;
        const screenY = (-worldPosition.y + 1) / 2 * height;
        mesh.div.style.left = screenX + 'px';
        mesh.div.style.top = screenY + 'px';
    });
}

function animate() {
    requestAnimationFrame(animate);
    updateCSS2DVisibility();
    controls.update();
    renderer.render(scene, camera);
}
```

## 小结

- 3D → 2D 核心一行：`worldPos.project(camera)`
- 生产环境优先 **CSS2DRenderer / CSS3DRenderer**
- 上一篇：[轮廓光](/examples/three/basic/outlinePass) · 下一篇：[渐变三角形](/examples/three/basic/gradientTriangle)

> 基础案例 · Three.js · 12/35
