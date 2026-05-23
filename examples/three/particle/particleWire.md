---
title: "粒子线 - Three.js 案例讲解"
description: "粒子线：Scene / Camera / Renderer 渲染管线、ShaderMaterial / RawShaderMaterial 自定义 GLSL、粒子 / 点云 / 实例化渲染（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,particleWire,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 粒子线

*Wire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=particleWire)

![粒子线](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleWire.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 定义 uniforms，在 rAF 中更新并 render
3. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);



const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);



const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

const particlesGeometry = new THREE.BufferGeometry();
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/particleWire.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=particleWire) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[球体线条](/examples/three/particle/sphereLine)
- 下一篇：[粒子烟花](/examples/three/particle/particleFire)

> 粒子 · Three.js · 13/27
