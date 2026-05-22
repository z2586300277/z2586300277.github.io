---
title: "动态管道 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `createMultiRadiusTube`、`getRadiusAt`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,动态管道,应用场景"
outline: deep
---

# 动态管道

*Dynamic Tube*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=dynamicTube)


![动态管道](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/dynamicTube.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `createMultiRadiusTube`、`getRadiusAt`。

> 应用场景 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(0, 30, 60)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 25, 0)
controls.update()

const effectComposer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(box.clientWidth, box.clientHeight), 0.8, 0.2, 0.0);
effectComposer.addPass(bloomPass);

const axes = new THREE.AxesHelper(16)
// scene.add(axes)

const controlPoints = [
    { point: new THREE.Vector3(0, 60, 0), radius: 3 },
    { point: new THREE.Vector3(0, 56, 0), radius: 3 },
    { point: new THREE
```

