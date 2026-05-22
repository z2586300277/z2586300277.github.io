---
title: "星系 - Three.js 案例讲解"
description: "Three.js 大量点/面片模拟粒子。主流程在 `initializeScene`、`onWindowResize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,星系"
outline: deep
---

# 星系

*Galaxy Star*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=galaxyStar)


![星系](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/galaxyStar.jpg)


## 效果说明

Three.js 大量点/面片模拟粒子。主流程在 `initializeScene`、`onWindowResize`。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化

## 源码

```js
import * as THREE from 'three';
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const initializeScene = ({ root, antialias = true } = {}) => {
  // Create scene
  const scene = new THREE.Scene();

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 110;

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  root.appendChild(renderer.domElement);

  const onWindowResize = () => {
    // Adjust camera and renderer on window resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };
  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  // Create GUI
  const gui = new GUI({ container: root });

  const stats = new Stats();
  stats.showP
```

