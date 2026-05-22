---
title: "随机城市白膜 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animationLoop`、`generateCityModel`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,随机城市白膜,应用场景"
outline: deep
---

# 随机城市白膜

*White Model*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=white model)


![随机城市白膜](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/white_model.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animationLoop`、`generateCityModel`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
const DOM = document.getElementById('box')

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight);
camera.position.set(-1, 0.5, 1).setLength(75);

camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setAnimationLoop(animationLoop);
function animationLoop() {
    renderer.render(scene, camera);
}
DOM.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 12, 0);

controls.update();
controls.enableDamping = true;
controls.autoRotate = true;

var light = new THREE.DirectionalLight('white', 3);
light.position.set(1, 1, 1);
scene.add(light);
import { Mesh, MathUtils, PlaneGeometry, Color,BoxGeometry,MeshBasicMaterial } from 'three';

/**
 * 生成仿真城市白膜
 */
const buildingGeometry = new BoxGeometry(1, 1, 1);
buildingGeometry.translate(0, 0.5, 0); // 调整几何中心点
const buildingMaterial = new MeshBasicMaterial({ color: 0xcccccc });
function generateCityModel() {
    const citySize =
```

