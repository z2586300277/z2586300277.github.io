---
title: "幻影花烟 - Three.js 案例讲解"
description: "幻影花烟：Scene / Camera / Renderer 渲染管线、相机交互控制器、onBeforeCompile 修改内置材质 shader（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,ephemeralFlower,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 幻影花烟

*Flower Smoke*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=ephemeralFlower)

![幻影花烟](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/ephemeralFlower.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- onBeforeCompile 修改内置材质 shader
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 替换 `#include <begin_vertex>` 等 chunk 注入特效，适合 PBR 材质叠加大屏效果。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. material.onBeforeCompile 注入 GLSL 与 uniform
4. gui.add 绑定可调参数

## 代码要点

```js
let innerHeight = window.innerHeight;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(10, 10, 7).setLength(13);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(10, 10, 7).setLength(13);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/ephemeralFlower.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=ephemeralFlower) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[发散着色器](/examples/three/shader/emitShader)
- 下一篇：[鱼](/examples/three/shader/fishShader)

> 着色器 · Three.js · 78/89
