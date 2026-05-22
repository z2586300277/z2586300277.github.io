---
title: "边缘模糊效果 - Three.js 案例讲解"
description: "边缘模糊效果：Scene / Camera / Renderer 渲染管线、ShaderMaterial / RawShaderMaterial 自定义 GLSL（后期处理）"
head:
  - - meta
    - name: keywords
      content: "three.js,effectComposer,EdgeBlurringEffect,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 边缘模糊效果

*Edge Blur*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=EdgeBlurringEffect)

![边缘模糊效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/EdgeBlurringEffect.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- ShaderMaterial / RawShaderMaterial 自定义 GLSL

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 定义 uniforms，在 rAF 中更新并 render
3. 搭建灯光与环境（如有）
4. requestAnimationFrame 循环 update + render

## 代码要点

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

scene.background = new Color(0xffffff);


const vertexShader = `
    precision highp float;
    precision highp int;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUv;
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/effectComposer/EdgeBlurringEffect.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=EdgeBlurringEffect) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[饱和度(自定义Pass)](/examples/three/effectComposer/saturationPass)
- 下一篇：[官方选择辉光简化版](/examples/three/effectComposer/threeSelectBloom)

> 后期处理 · Three.js · 7/10
