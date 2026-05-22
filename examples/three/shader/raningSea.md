---
title: "波涛海浪 - Three.js 案例讲解"
description: "波涛海浪：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,raningSea,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 波涛海浪

*move Sea*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=raningSea)

![波涛海浪](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/raningSea.jpg)

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
// refer https://codepen.io/aderaaij/pen/XWpMONO
const vertexShader = ` #include <fog_pars_vertex>

uniform float uTime;

uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWaveSpeed;



const fragmentShader = `  #include <fog_pars_fragment>
precision mediump float;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;



const scene = new THREE.Scene();
scene.fog = new THREE.Fog(
  debugObject.fogColor,
  debugObject.fogNear,
  debugObject.fogFar
);
scene.background = new THREE.Color(debugObject.fogColor);
const waterGeometry = new THREE.PlaneGeometry(12, 12, 512, 512);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/raningSea.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=raningSea) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[three.js Logo](/examples/three/shader/threeLogo)
- 下一篇：[警告信息](/examples/three/shader/warnInfo)

> 着色器 · Three.js · 17/89
