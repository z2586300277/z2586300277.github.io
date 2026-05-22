---
title: "渲染器配置 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,渲染器配置,基础案例"
outline: deep
---

# 渲染器配置

*Effect Composer*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=effectComposer)


![渲染器配置](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/effectComposer.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `animate`。

> 基础案例 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(5, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setClearColor(0xbfe3dd, 1)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass);

cons
```

