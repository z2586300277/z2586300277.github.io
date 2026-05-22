---
title: "图片抖动 - Three.js 案例讲解"
description: "图片抖动：Scene / Camera / Renderer 渲染管线、ShaderMaterial / RawShaderMaterial 自定义 GLSL、粒子 / 点云 / 实例化渲染（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,imageShake,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 图片抖动

*Image Shake*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=imageShake)

![图片抖动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/imageShake.jpg)

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
scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;
  camera.lookAt(scene.position)

  renderer = new THREE.WebGLRenderer({
    antialias: true


  camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;
  camera.lookAt(scene.position)

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);


  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  container.appendChild(renderer.domElement);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/imageShake.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=imageShake) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[溶解动画](/examples/three/shader/dissolveAnimate)
- 下一篇：[心](/examples/three/shader/heartShader)

> 着色器 · Three.js · 56/89
