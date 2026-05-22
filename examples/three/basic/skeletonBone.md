---
title: "骨骼动画 - Three.js 案例讲解"
description: "本案例展示 **骨骼动画** 的实现。涉及：相机交互控制器、天空盒与环境贴图、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,骨骼动画"
outline: deep
---
# 骨骼动画

*Skeleton Bone*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=skeletonBone)

![骨骼动画](https://z2586300277.github.io/3d-file-server/threeExamples/basic/skeletonBone.jpg)

## 你将学到什么

- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **骨骼动画** 的实现。涉及：相机交互控制器、天空盒与环境贴图、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`initScene()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createBones()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createMesh()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`setupDatGui()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initBones()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);

    window.addEventListener(
        "resize",
        function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        },
        false
    );

    initBones();
    setupDatGui();
}

function createGeometry(sizing) {
    // const geometry = new CylinderGeometry(
    // 	5, // radiusTop
    // 	5, // radiusBottom
    // 	sizing.height, // height
    // 	8, // radiusSegments
    // 	sizing.segmentCount * 3, // heightSegments
    // 	true // openEnded
    // );

    const geometry = new BoxGeometry(5,sizing.height,5,1,sizing.segmentCount*10)

    const position = geometry.attributes.position;

    const vertex = new Vector3();

    const skinIndices = [];
    const skinWeights = [];

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);

        const y = vertex.y + sizing.halfHeight;

        const skinIndex = Math.floor(y / sizing.segmentHeight);
        const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

        skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
        skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    geometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4));

    return geometry;
}

function createBones(sizing) {
    bones = [];

    let prevBone = new Bone();
    bones.push(prevBone);
    prevBone.position.y = -sizing.halfHeight;

    for (let i = 0; i < sizing.segmentCount; i++) {
        const bone = new Bone();
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=skeletonBone) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
