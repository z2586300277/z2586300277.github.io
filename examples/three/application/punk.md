---
title: "朋克风 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animationLoop`、`CircularMotionOfLetters`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,朋克风,应用场景"
outline: deep
---

# 朋克风

*Style Punk*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=punk)


![朋克风](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/punk.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animationLoop`、`CircularMotionOfLetters`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `CircularMotionOfLetters()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

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
import{BoxGeometry, MeshLambertMaterial,Mesh,CanvasTexture,MeshBasicMaterial,Clock,CylinderGeometry,MathUtils,RepeatWrapping
} from 'three';

function CircularMotionOfLetters() {
    let g = new BoxGeometry();
    g.translate(0, 0.5, 0);
    let m = new MeshLambertMaterial({ color: 0x7f7f7f });
    for (let z = -5; z < 5; z++) {
    
```

