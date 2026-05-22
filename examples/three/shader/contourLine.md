---
title: "等高线 - Three.js 案例讲解"
description: "等高线：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,contourLine,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 等高线

*Contour Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contourLine)

![等高线](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/contourLine.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. gui.add 绑定可调参数

## 代码要点

```js
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0x161616, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 26, 40);



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 26, 40);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.maxDistance = 25;


const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 26, 40);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.maxDistance = 25;

class PerlinNoise {
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/contourLine.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contourLine) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[黑洞](/examples/three/shader/blackhole)


> 着色器 · Three.js · 89/89
