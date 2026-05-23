---
title: "测量 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,测量"
outline: deep
---
# 测量

*Line Measure*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=lineMeasure)

![测量](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lineMeasure.jpg)

## 你将学到什么

- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`onDragChanged()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onDragChanging()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onDragend()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onMousedown()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`updateLinePoints()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onMousemove()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
    scene.add(markersGroup);

    camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        100
    );
    camera.position.set(10, 10, 10);

    //plane
    let planeGeo = new THREE.PlaneGeometry(40, 40, 40);
    let planeMat = new THREE.MeshBasicMaterial({ color: 0x6666666 });
    plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // orbit
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 0.5, 0);
    orbitControls.update();
    orbitControls.enableDamping = true;

    // transform
    transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener("dragging-changed", onDragChanged);
    transformControls.addEventListener("mouseUp", onDragend);
    transformControls.addEventListener("change", onDragChanging);
    scene.add(transformControls);
    function onDragChanged(event) {
        orbitControls.enabled = !event.value;
    }

    document.body.addEventListener("mousedown", onMousedown, false);
    document.body.addEventListener("mousemove", onMousemove, false);
    window.onresize = function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
}
function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}
function onDragChanging(event) {
    if (points.length < 2) return;

    let point = mesh.position;
    let _idx = mesh._idx;
    updatePoints(points, _idx, point);

    totalDistance = updateDistanceArray(points, distanceArray);
    distanceDom.innerHTML = totalDistance.toFixed(2) + "m";
    const positions =
        "array" in line.geometry.attributes.position &&
        line.geometry.attributes.position.array;

    if (_idx === 0) {
        positions[0] = point.x;
        positions[1] = point.y;
        positions[2] = point.z;
    } else {
        let i = (2 * _idx - 1) * 3;
        positions[i] = point.x;
        positions[i + 1] = point.y;
        positions[i + 2] = point.z;
        positions[i + 3] = point.x;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=lineMeasure) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
