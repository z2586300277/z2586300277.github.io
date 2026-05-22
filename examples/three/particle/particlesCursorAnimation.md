---
title: "鼠标轨迹粒子 - Three.js 案例讲解"
description: "鼠标轨迹粒子：Scene / Camera / Renderer 渲染管线、相机交互控制器、外部模型 / 3D Tiles 加载（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,particlesCursorAnimation,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 鼠标轨迹粒子

*ParticlesCursorAnimation*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particlesCursorAnimation)

![鼠标轨迹粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particlesCursorAnimation.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，加载外部模型，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. 定义 uniforms，在 rAF 中更新并 render
5. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const vertexShader=`
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;


`
const fragmentShader=`
precision mediump float;

uniform vec2 uResolution;

uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereNightColor;

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/particlesCursorAnimation.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particlesCursorAnimation) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[科技粒子](/examples/three/particle/technologyParticle)
- 下一篇：[文字采集成粒子](/examples/three/particle/textParticle)

> 粒子 · Three.js · 17/27
