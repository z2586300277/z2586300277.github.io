---
title: "粒子地球 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,粒子地球"
outline: deep
---

# 粒子地球

*Points Earth*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=pointsEarth)


![粒子地球](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/pointsEarth.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let gui = new GUI();
// 初始化场景、相机和渲染器
const gl = {
    clearColor: '#332148',
    shadows: false,
    alpha: false,
    outputColorSpace: THREE.SRGBColorSpace,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

const renderer = new THREE.WebGLRenderer({ alpha: gl.alpha });
renderer.setClearColor(gl.clearColor);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
// 设置相机位置
camera.position.z = 2;
// Shaders
const vertexShader = `  uniform float size;
uniform sampler2D elevTexture;
uniform sampler2D alphaTexture;
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveSpeed;

varying vec2 vUv;
varying float vVisible;
varying float vAlpha;
varying float vElevation;
// Function to generate fBm with vec3 input
float random(vec3 st) {
return fract(sin(dot(st.xyz, vec3(12.9898,78.233,45.164))) * 43758.5453123);
}

float noise(vec3 st) {
vec3 i = floor(st);
vec3 f = fract(st);

// Eight corners 
```

