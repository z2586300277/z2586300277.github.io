---
title: "管道表面运动 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`create_pipe`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,管道表面运动,应用场景"
outline: deep
---

# 管道表面运动

*Flow Tube*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flowTube)


![管道表面运动](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/flowTube.png)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`create_pipe`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render
- `create_pipe()` — 材质 / GLSL

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
const box = document.getElementById("box");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  box.clientWidth / box.clientHeight,
  0.1,
  1000
);

camera.position.set(30, 10, 10)

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

window.onresize = () => {
  renderer.setSize(box.clientWidth, box.clientHeight);

  camera.aspect = box.clientWidth / box.clientHeight;
  camera.updateProjectionMatrix();
};

animate();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

scene.add(new THREE.AmbientLight(0xffffff, 1));
scene.add(new THREE.DirectionalLight(0xffffff, 0.25));

function create_pipe() {
    const cps = Array.from({ length: 6 }).fill(0).map((_, idx, arr) => {
        let init = -(arr.length - 1)
        return new THREE.Vector3(
            init + idx * 2, Math.random() < 0.5 ? -1 : 1,
            -init - idx * 2
        )
    })
    const curve = new THREE.CatmullRomCurve3(cps)
    let g = new THREE.TubeGeometry(curve, 100, 0.5, 32)
    
```

