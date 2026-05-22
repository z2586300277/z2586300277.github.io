---
title: "燃烧烟雾 - Three.js 案例讲解"
description: "燃烧烟雾：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,smoke,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 燃烧烟雾

*Smoke*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=smoke)

![燃烧烟雾](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/smoke.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render

## 代码要点

```js
const DOM = document.querySelector("#box"), width = DOM.clientWidth, height = DOM.clientHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xbfe3dd, 1)
renderer.setSize(width, height);
DOM.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100000).translateX(5);
new OrbitControls(camera, renderer.domElement).target.set(0, 0.5, 0);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100000).translateX(5);
new OrbitControls(camera, renderer.domElement).target.set(0, 0.5, 0);

// 核心变量
const clock = new THREE.Clock(), particles = [];
let delta = 0, emitTime = 0;
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/smoke.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=smoke) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[全息投影](/examples/three/shader/hologram)
- 下一篇：[火焰材质](/examples/three/shader/fireMaterial)

> 着色器 · Three.js · 83/89
