---
title: "巡检 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `init`、`onResize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,巡检,动画效果"
outline: deep
---

# 巡检

*Inspection View*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=inspectionView)


![巡检](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/inspectionView.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `init`、`onResize`。

> 动画效果 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化

## 源码

```js
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { animate } from "animejs";

let scene, renderer, camera, orbitControls;

let isRoaming = false; // 漫游模式标志

let camera2; // 主要用于动画的相机
const eye1 = new THREE.Object3D();

let pointerlockControls;

// 用于动画的位置/旋转数据对象（animejs 直接修改此对象属性）
const itemData = { px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0 };

window.addEventListener('load', () => {
    init();
    render();
    eventBinding();
});

// 初始化
function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(100, 100, 100);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    camera2 =
```

```js
/*
 * 关键开发思路
 * 1. 使用 eye1 对象执行路径移动
 * 2. 利用鼠标事件对 camera2 进行方向控制
 * 3. 松开鼠标时，执行相机回归中心方向的动画
 */
function render() {
    requestAnimationFrame(render);
    orbitControls.update();
    renderer.render(scene, isRoaming ? camera2 : camera);
}

// 相机视角回归动画（使用四元数避免 rotation 动画的万向锁问题）
function cameraReturn() {
    animate(camera2.quaternion, {
        x: 0, y: 0, z: 0, w: 1,
        ease: "linear",
        duration: 500
    });
}
```

