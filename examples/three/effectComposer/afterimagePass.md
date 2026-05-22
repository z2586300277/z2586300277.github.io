---
title: "残影效果 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `onWindowResize`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,残影效果,后期处理"
outline: deep
---

# 残影效果

*Afterimage*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=afterimagePass)


![残影效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/afterimagePass.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `onWindowResize`、`animate`。

> 后期处理 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js ';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000');
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// 添加光源
const directionalLight = new THREE.DirectionalLight('#fff');
directionalLight.position.set(30, 30, 30).normalize();
scene.add(directionalLight);
const ambientLight = new THREE.AmbientLight('#fff', 2);
scene.add(ambientLight);

// 添加性能监控
const stats = new Stats();
document.body.appendChi
```

