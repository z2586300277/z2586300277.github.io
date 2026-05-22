---
title: "测量 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `init`、`onDragChanged`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,测量,应用场景"
outline: deep
---

# 测量

*Line Measure*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lineMeasure)


![测量](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lineMeasure.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `init`、`onDragChanged`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

const worldToScreenPosition = (pos, camera) => {
    // 三维坐标转换成屏幕坐标
    const worldVector = new THREE.Vector3(pos.x, pos.y, pos.z);
    const standardVector = worldVector.project(camera);
    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;
    return {
        x: Math.round(standardVector.x * widthHalf + widthHalf),
        y: Math.round(-standardVector.y * heightHalf + heightHalf),
        z: 1,
    };
}

let renderer, scene, camera, orbitControls, transformControls;

let plane;
let raycaster = new THREE.Raycaster();
let intersects;
let mouse = new THREE.Vector2();
let markersGroup = new THREE.Group();
let markers = [];
let points = [];
let vec2Array = [];
let dashLine;
let line;
let canDrawLine = true;
let mesh;
let index = 0;
let distanceArray = [];
let distance = 0;
let totalDistance = 0;
let geometry = null;
let distanceDom = null;
let nextPoint = null;

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEnco
```

