---
title: "截图 - Three.js 案例讲解"
description: "canvas.toDataURL 导出 PNG，含 EffectComposer 后期时先 composer.render"
head:
  - - meta
    - name: keywords
      content: "three.js,截图,toDataURL,preserveDrawingBuffer"
outline: deep
---

# 截图

*Screenshot*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=screenShot)

## 你将学到什么

- **`renderer.domElement.toDataURL()`** 导出 canvas 为 PNG
- 有 **Bloom 后期** 时需 `composer.render()` 再截图
- 编程触发 `<a download>` 下载

## 效果说明

黄色立方体 + UnrealBloomPass 辉光。点击「截图」下载 `myImage.png`。

## 核心概念

```js
function screenShot() {
    renderer.render(scene, camera);  // 可选
    composer.render();               // 含后期时必须
    const base64 = renderer.domElement.toDataURL('image/png', 0.8);
    const link = document.createElement('a');
    link.href = base64;
    link.download = 'myImage.png';
    link.click();
}
```

::: tip
若截图为黑，初始化 Renderer 时设 `preserveDrawingBuffer: true`。
:::

## 小结

- 上一篇：[相机动画](/examples/three/basic/cameraAnimate) · 下一篇：[骨骼动画](/examples/three/basic/skeletonBone)

> 基础案例 · Three.js · 25/35
