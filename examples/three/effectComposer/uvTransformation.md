---
title: "UV图像变换 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `resize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,UV图像变换"
outline: deep
---

# UV图像变换

*UV Transform*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=uvTransformation)


![UV图像变换](https://z2586300277.github.io/3d-file-server/images/four/uvTransformation.png)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `resize`。

> 后期处理 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RenderPass, EffectPass, EffectComposer, GodRaysEffect } from 'postprocessing'
// Max Muselmann https://unsplash.com/photos/oIVvGqqwVJw
const image_url =
  FILE_HOST + "images/four/photo-1583766395091-2eb9994ed094.avif";
const image_ratio = 687 / 1031;
const image_tex = new THREE.TextureLoader().load(image_url);
image_tex.repeat.set(1, 1);

// Daniil Silantev https://unsplash.com/photos/dxGTQArsC3M
const alpha_url =
  FILE_HOST + "images/four/photo-1510942752400-ebce99a8a2c0.avif";
const alpha_tex = new THREE.TextureLoader().load(alpha_url);
alpha_tex.repeat.set(0.6, 2);
alpha_tex.offset.x = (1 - alpha_tex.repeat.x) / 2;
alpha_tex.wrapT = THREE.RepeatWrapping;

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 1);
controls.enableDamping = true;

const light = new THREE.DirectionalLight();
light.position.set(0, 0, 1);
scene.add(light);

const geom = new THREE.PlaneGeometry(image_ratio * 2, 2);
const mat = new THREE.MeshLambertMaterial({
  alphaMap: alpha_tex,
  alphaTest: 0.15,
  map: image_tex,
});
const mesh = new THREE.Mesh(g
```

