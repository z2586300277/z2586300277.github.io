---
title: "音乐可视化 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。将音乐可视化为动态效果。主流程在 `init`、`tick`。"
head:
  - - meta
    - name: keywords
      content: "three.js,音乐可视化"
outline: deep
---

# 音乐可视化

*Audio visual*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=audioSolutions)


![音乐可视化](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/audioSolutions.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。将音乐可视化为动态效果。主流程在 `init`、`tick`。

> 着色器 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let mediaElement;
let analyser;
let scene;
let camera;
let renderer;
let controls;
let mesh;

const fftSize = 4096;
const clock = new THREE.Clock();
const uniform = {
  uTime: { value: 0 },
  tAudioData: { value: 0 },
  uStrength: { value: 0 },
};
const box = document.getElementById("box");

const init = () => {
  // Scene
  scene = new THREE.Scene();

  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.7;
  const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniform.uTime;
    shader.uniforms.uStrength = uniform.uStrength;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
              #include <common>
              attribute float aOffset;
              varying vec2 vUv;
              uniform float uTime;
              uniform float uStrength;

              //	Simplex 4D Noise
  //	by Ian McEwan, Ashima Arts
  //
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float taylorI
```

