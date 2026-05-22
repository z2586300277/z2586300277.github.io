---
title: "第一人称房屋 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `create`、`createHouse`。"
head:
  - - meta
    - name: keywords
      content: "three.js,第一人称房屋"
outline: deep
---

# 第一人称房屋

*House Scene*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=houseScene)


![第一人称房屋](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/houseScene.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `create`、`createHouse`。

> 应用场景 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `createGrass()` — 材质 / GLSL
- `createFloor()` — 材质 / GLSL
- `createSideWall()` — 材质 / GLSL
- `createBackWall()` — 材质 / GLSL
- `createRoof()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

const host = FILE_HOST + 'examples/flowerAndHouse';

const box = document.getElementById('box');

const width = box.clientWidth;
const height = box.clientHeight;
const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

const scene = new THREE.Scene();

const house = new THREE.Group();

const renderer = new THREE.WebGLRenderer();

function create() {
    renderer.setSize(width, height);
    //设置背景颜色
    renderer.setClearColor(0xcce0ff, 1);
    box.appendChild(renderer.domElement);

    camera.position.set(-500, 60, 0)
    camera.lookAt(scene.position);

    const light = new THREE.AmbientLight(0xCCCCCC);
    scene.add(light);

    const axisHelper = new THREE.AxesHelper(1000);
    scene.add(axisHelper);

    createGrass();
    
    createHouse();

    function createHouse() {
        createFloor();
        
        const sideWall = createSideWall();
        const sideWall2 = createSideWall();
        sideWall2.position.z = 300;

        createFrontWall();
        createBackWall();

        const roof = createRoof();
        const roof2 = createRoof();
        roof2.rotation.x = Math.PI / 2;
        roof2.rotation.y = Math.
```

