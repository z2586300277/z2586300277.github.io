---
title: "等值线 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animationLoop`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,等值线,应用场景"
outline: deep
---

# 等值线

*Isoline*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=isoline)


![等值线](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/isoline.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animationLoop`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
const DOM = document.getElementById('box')

var scene = new THREE.Scene();
scene.background = new THREE.Color('gainsboro');

var camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight);
camera.position.set(0, 4, 4);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setAnimationLoop(animationLoop);
DOM.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

var light = new THREE.DirectionalLight('white', 3);
light.position.set(1, 1, 1);
scene.add(light);

// next comment

// a texture with isolines
var canvas = document.createElement('CANVAS');
canvas.width = 16;
canvas.height = 128;

var context = canvas.getContext('2d');
context.fillStyle = 'royalblue';
context.fillRect(0, 0, 16, 128);
context.fillStyle = 'white';
context.fillRect(0, 0, 16, 6);

var isoTexture = new THREE.CanvasTexture(canvas);
```

