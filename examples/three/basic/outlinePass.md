---
title: "轮廓光 - Three.js 案例讲解"
description: "OutlinePass 选中高亮、EffectComposer 后期链与 Raycaster 点击拾取"
head:
  - - meta
    - name: keywords
      content: "three.js,OutlinePass,轮廓光,EffectComposer,选中高亮"
outline: deep
---

# 轮廓光

*Outline Pass*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=outlinePass)

![轮廓光](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/outlinePass.jpg)

## 你将学到什么

- **OutlinePass** 给选中物体加发光轮廓
- **EffectComposer** Pass 链：RenderPass → OutlinePass → OutputPass
- 点击 **Raycaster** 更新 `outlinePass.selectedObjects`

## 效果说明

10 个随机彩色立方体，**点击某个 cube** 后出现 **描边高亮**；点击空白处取消。常用于编辑器选中、策略游戏单位选中。

## 核心概念

### 后期管线

```js
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(outlinePass);
composer.addPass(new OutputPass());  // 色彩空间校正

// 循环里用 composer.render() 替代 renderer.render()
```

### OutlinePass

```js
const outlinePass = new OutlinePass(
    new THREE.Vector2(width, height),
    scene,
    camera
);
outlinePass.selectedObjects = [mesh];  // 要高亮的物体数组
```

可配置 `edgeStrength`、`edgeGlow`、`visibleEdgeColor` 等（本案例用默认）。

### 点击拾取

```js
const mouse = new THREE.Vector2(
    (offsetX / width) * 2 - 1,
    -(offsetY / height) * 2 + 1
);
raycaster.setFromCamera(mouse, camera);
const hits = raycaster.intersectObjects(scene.children);
outlinePass.selectedObjects = hits.length ? [hits[0].object] : [];
```

::: tip
`intersectObjects` 默认不递归；若模型是 Group，需传 `true` 递归子 Mesh。
:::

## 源码

完整源码见 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=outlinePass)（与仓库 `outlinePass.js` 一致）。

核心结构：

```js
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const outlinePass = new OutlinePass(new THREE.Vector2(w, h), scene, camera);
composer.addPass(outlinePass);
composer.addPass(new OutputPass());

box.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2(/* NDC 坐标 */);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    outlinePass.selectedObjects = intersects.length ? [intersects[0].object] : [];
});

function animate() {
    controls.update();
    composer.render();
}
```

## 小结

- 轮廓光 = **OutlinePass + selectedObjects**，编辑器选中态标配
- 更多 Pass 见 [后期处理目录](/examples/three/effectComposer/)
- 上一篇：[加载动画](/examples/three/basic/loadingAnimate) · 下一篇：[三维转屏幕坐标](/examples/three/basic/screenCoord)

> 基础案例 · Three.js · 11/35
