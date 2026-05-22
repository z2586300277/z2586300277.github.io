---
title: "星系 - Three.js 案例讲解"
description: "Three.js 大量点/面片模拟粒子。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,星系"
outline: deep
---
# 星系

*Galaxy Star*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=galaxyStar)

![星系](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/galaxyStar.jpg)

## 你将学到什么

- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- GUI 面板调试参数
- Stats 性能监视

## 效果说明

Three.js 大量点/面片模拟粒子。

> 粒子 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

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
  stats.showPanel(0);
  root.appendChild(stats.domElement);

  return {
    scene,
    renderer,
    camera,
    controls,
    gui,
    stats,
  };
}
const getRandomPolarCoordinate = (radius) => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI * 2;
  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);
  return { x, y, z };
}

const init = (root) => {
  const params = {
    particleCount: 250000,
    particleSize: 0.02,
    branches: 6,
    branchRadius: 5,
    spin: 0.2,
    radialRandomness: 0.5,
    innerColor: '#ff812e',
    outerColor: '#a668ff',
  };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  camera.position.set(7, 4, 7);
  controls.update();

  let spinDirection = 1;
  let material = null;
  let geometry = null;
  let points = null;

  const particleTexture = new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/star.png');

  const generateGalaxy = () => {
    // Remove old particles
    if (points) {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    }

    // Create new particles
    const positions = new Float32Array(params.particleCount * 3);
    const colors = new Float32Array(params.particleCount * 3);
    const innerColor = new THREE.Color(params.innerColor);
    const outerColor = new THREE.Color(params.outerColor);
    for (let i = 0; i < params.particleCount; i++) {
      const i3 = i * 3;

      const radius = params.branchRadius * Math.random();
      const branchAngle =
        ((i % params.branches) / params.branches) * Math.PI * 2;
      const spinAngle = params.spin * radius * Math.PI * 2;

      const randRadius = Math.random() * params.radialRandomness * radius;
      const {
        x: randX,
        y: randY,
        z: randZ,
      } = getRandomPolarCoordinate(randRadius);

      positions[i3] = radius * Math.cos(branchAngle + spinAngle) + randX;
      positions[i3 + 1] = randY;
      positions[i3 + 2] = radius * Math.sin(branchAngle + spinAngle) + randZ;

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=galaxyStar) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
