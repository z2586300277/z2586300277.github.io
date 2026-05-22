---
title: "粒子线条 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`getRandomColor`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,粒子线条,粒子"
outline: deep
---

# 粒子线条

*Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleLine)


![粒子线条](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleLine.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`getRandomColor`。

> 粒子 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `getRandomColor()` — 材质 / GLSL
- `changeColor()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform sampler2D tDiffuse;
      uniform vec2 resolution;
      uniform float pixelSize;
      varying vec2 vUv;
      void main() {
          vec2 dxy = pixelSize / resolution;
          vec2 coord = dxy * floor(vUv / dxy);
          gl_FragColor = texture2D(tDiffuse, coord);
      }
```

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';      
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { GUI } from 'dat.gui';

let scene, camera, renderer, particles, lines, mouse, controls, gui, glitchPass, dotScreenPass, pixelPass, composer, material, lineMaterial;
const params = {
  particleCount: 1000,
  lineDistance: 1000,
  repulsionStrength: 5,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0,
  pixelSize: 1.0,
  bloomStrength: 1,
  bloomRadius: 0.4,
  bloomThreshold: 0,
  activateGlitch: false,
  dotScale: 0.5,
  activateDotScreen: false 
};

init()
animate()

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1200;
  scene.fog = new THREE.Fog( 0x000000, 10, 2000 );
  renderer = new THREE.WebGLRenderer();
  re
```

