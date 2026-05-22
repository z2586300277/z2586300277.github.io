---
title: "雪花 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,雪花,粒子"
outline: deep
---

# 雪花

*Snow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=snowParticle)


![雪花](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/snowParticle.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

new OrbitControls(camera, renderer.domElement);

let gu = {
  time: {value: 0}
}

class Flakes extends THREE.Points{
  constructor(gu){
    let flakeData = [];
    let g = new THREE.BufferGeometry().setFromPoints(new Array(1000).fill().map(_ => {
      flakeData.push(((Math.random() < 0.5) ? -1 : 1), 0, 0, 0);
      return new THREE.Vector3().random().subScalar(0.5).multiplyScalar(10)
    }));
    g.setAttribute("flakeData", new THREE.Float32BufferAttribute(flakeData, 4));
    let m = new THREE.PointsMaterial({
      color: 0xfbec5d,
      size: 0.75,
      onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.vertexShader = `
          uniform float time;
          attribute vec4 flakeData;
          varying vec4 vFlakeData;
          varying float vId;
          ${
```

