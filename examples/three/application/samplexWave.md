---
title: "采样波 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。use Claude 3.7 sonnect Thinking Preivew in vscode github copilot generate all code。入口在 `EnhancedNoise`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,采样波,应用场景"
outline: deep
---

# 采样波

*Samplex Wave*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=samplexWave)


![采样波](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/samplexWave.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。use Claude 3.7 sonnect Thinking Preivew in vscode github copilot generate all code。入口在 `EnhancedNoise`。

> 应用场景 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

## 类与方法

### EnhancedNoise

- `constructor()` — 初始化成员
- `noise4d()`

## 独立函数

- `Shape()` — 材质 / GLSL
- `generateShapes()` — 移除 Entity / 解绑监听

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// 获取容器元素
const box = document.getElementById('box');

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// 设置渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(box.clientWidth, box.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
box.appendChild(renderer.domElement);

// 创建相机
const camera = new THREE.PerspectiveCamera(45, box.clientWidth / box.clientHeight, 0.1, 100);
camera.position.set(0, 20, 35);
scene.add(camera);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// 添加灯光
const ambientLight = new THREE.AmbientLight(0x555555);
scene.add(ambientLight);

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.po
```

