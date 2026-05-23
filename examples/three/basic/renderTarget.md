---
title: "渲染贴图物体 - Three.js 案例讲解"
description: "WebGLRenderTarget 离屏渲染，Layers 分层写入纹理贴到平面/球"
head:
  - - meta
    - name: keywords
      content: "three.js,RenderTarget,离屏渲染,Layers"
outline: deep
---

# 渲染贴图物体

*Render Target*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=renderTarget)

## 你将学到什么

- **WebGLRenderTarget** 渲染到纹理
- **camera.layers** 切换：先拍模型，再拍 UI 层
- 纹理贴到 **Plane / Sphere** 当「监视器」

## 效果说明

电脑模型只在 layer 1。第一遍相机 layer 1 → renderTarget；第二遍 layer 0 显示带「屏幕内容」的平面和球体。

## 核心概念

```js
const rt = new THREE.WebGLRenderTarget(w, h);
model.traverse(c => c.layers.set(1));

function animate() {
    camera.layers.set(1);
    renderer.setRenderTarget(rt);
    renderer.render(scene, camera);

    camera.layers.set(0);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);  // plane.map = rt.texture
}
```

镜子、小地图、Portal 都基于此模式。

## 小结

- 上一篇：[帧率控制](/examples/three/basic/renderFrame) · 下一篇：[场景剪切](/examples/three/basic/sceneScissor)

> 基础案例 · Three.js · 29/35
