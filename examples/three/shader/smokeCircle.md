---
title: "圆泡吸附 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `init`、`createWorld`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,圆泡吸附,着色器"
outline: deep
---

# 圆泡吸附

*Smoke Circle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=smokeCircle)


![圆泡吸附](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/smokeCircle.jpg)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `init`、`createWorld`。

> 着色器 · Three.js

## 实现思路

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `createLights()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three';
import gsap from 'gsap';

// reference Victor Vergara https://codepen.io/vcomics/pen/KBMyjE
window.addEventListener('load', init, false);
function init() {
  createWorld();
  createLights();
  createPrimitive();
  createParticleWord();
  animation();
}
var scene, camera, renderer;
var world = new THREE.Object3D();
var _width, _height;
function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 4, 12);
  //scene.background = new THREE.Color(0xF00000);
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,0,8);

  renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
  console.log('- resize -');
}
var _ambientLights, _lights;
function createLights() {
  _ambientLights = new THREE.HemisphereLight(0x111111, 0x000000, 5);
  _lights = new THREE.PointLight(0xF00555, 0.5);
  _lights.position.
```

