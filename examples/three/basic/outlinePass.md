---
title: "轮廓光 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,轮廓光"
outline: deep
---

# 轮廓光

*Outline Pass*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=outlinePass)


![轮廓光](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/outlinePass.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `animate`。

> 基础案例 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(15, 15, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

controls.dampingFactor = 0.02

// 后期处理
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

// 轮廓
const outlinePass = new OutlinePass(new THREE.Vector2(box.clientWidth, box.clientHeight), scene, camera);

composer.addPass(outlinePass);

// 色彩校正
const outputPass = new OutputPass();

composer.addPass(outputPass);

// 渲染
animate()

function animate
```

