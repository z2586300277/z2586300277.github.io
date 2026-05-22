---
title: "模型导航 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`add_nav_mesh`。"
head:
  - - meta
    - name: keywords
      content: "three.js,模型导航"
outline: deep
---

# 模型导航

*Model Nav*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=model_navigation)


![模型导航](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/nav.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`add_nav_mesh`。

> 应用场景 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
// 模型导航 从0，0，0自动寻路至56，0，0 改变坐标即可重新计算（version：0.1:导航错误等未处理）
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const box = document.getElementById("box");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  box.clientWidth / box.clientHeight,
  0.1,
  1000
);

camera.position.set(20, 50, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

renderer.setSize(box.clientWidth, box.clientHeight);

scene.add(new THREE.AxesHelper(10))
scene.add(new THREE.GridHelper(100, 100))
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
  TWEEN.update()
  renderer.render(scene, camera);
}

scene.add(new THREE.AmbientLight(0xfff, 4));
// 加载模型 gltf/ glb  draco解码器
const loader = new GLTFLoader();

loader.setDRACOLoader(
  new DRACOLoader().setDecoderPath(
    FILE_HOST + "js/
```

