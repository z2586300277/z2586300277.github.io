---
title: "雪花 - Three.js 案例讲解"
description: "雪花：Scene / Camera / Renderer 渲染管线、相机交互控制器、onBeforeCompile 修改内置材质 shader（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,snowParticle,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 雪花

*Snow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=snowParticle)

![雪花](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/snowParticle.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- onBeforeCompile 修改内置材质 shader
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 替换 `#include <begin_vertex>` 等 chunk 注入特效，适合 PBR 材质叠加大屏效果。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. material.onBeforeCompile 注入 GLSL 与 uniform
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/snowParticle.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=snowParticle) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[文字采集成粒子](/examples/three/particle/textParticle)
- 下一篇：[图片粒子](/examples/three/particle/imgParticle)

> 粒子 · Three.js · 19/27
