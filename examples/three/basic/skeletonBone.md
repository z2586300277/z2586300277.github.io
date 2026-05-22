---
title: "骨骼动画 - Three.js 案例讲解"
description: "Three.js Scene/Camera/Renderer 基础搭建。主流程在 `initScene`、`createGeometry`。"
head:
  - - meta
    - name: keywords
      content: "three.js,骨骼动画"
outline: deep
---

# 骨骼动画

*Skeleton Bone*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=skeletonBone)


![骨骼动画](https://z2586300277.github.io/3d-file-server/threeExamples/basic/skeletonBone.jpg)


## 效果说明

Three.js Scene/Camera/Renderer 基础搭建。主流程在 `initScene`、`createGeometry`。

> 基础案例 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `createBones()` — 材质 / GLSL
- `createMesh()` — 材质 / GLSL
- `render()` — renderer.render(scene, camera)

## 源码

```js
import {
    Bone,
    Color,
    CylinderGeometry,
    BoxGeometry,
    DirectionalLight,
    DoubleSide,
    Float32BufferAttribute,
    MeshPhongMaterial,
    PerspectiveCamera,
    Scene,
    SkinnedMesh,
    Skeleton,
    SkeletonHelper,
    Vector3,
    Uint16BufferAttribute,
    WebGLRenderer,
} from "three";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let gui, scene, camera, renderer, orbit, lights, mesh, bones, skeletonHelper;

const state = {
    animateBones: false,
};

function initScene() {
    gui = new GUI();

    scene = new Scene();
    scene.background = new Color(0x444444);

    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 30;
    camera.position.y = 30;

    renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableZoom = false;

    lights = [];
    lights[0] = new DirectionalLight(0xffffff, 3);
    lights[1] = new DirectionalLight(0xffffff, 3);
    lights[2] = new DirectionalLight(0xffffff, 3);

    lights[0].position.s
```

