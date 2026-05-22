---
title: "球体线条 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `getPos`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,球体线条,粒子"
outline: deep
---

# 球体线条

*Sphere Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=sphereLine)


![球体线条](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/sphereLine.jpg)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `getPos`、`animate`。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000)

camera.position.set(1000, 1000, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

let group;
let particlesData = [];
let positions, colors;
let particles;
let pointCloud;
let particlePositions;
let linesMesh;

let maxParticleCount = 1000;
let particleCount = 500;
let r = 800;

let effectController = {
    showDots: true,
    showLines: true,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500
}

group = new THREE.Group();
scene.add(group);

let segments = maxParticleCount * maxParticleCount;

positions = new Float32Array(segments * 3);
colors = new Float32Array(segments * 3);

let pMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 3,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAtten
```

