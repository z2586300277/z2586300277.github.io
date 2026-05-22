---
title: "扩散半球 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `scatter3DCircle`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,扩散半球"
outline: deep
---

# 扩散半球

*3D Circle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=3DCircle)


![扩散半球](https://z2586300277.github.io/3d-file-server/images/four/3DCircle.png)


## 效果说明

Three.js 业务向场景组合。主流程在 `scatter3DCircle`、`animate`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `scatter3DCircle()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "three/addons/libs/tween.module.js";

const scene = new THREE.Scene(); // 创建场景
const geometry = new THREE.BoxGeometry(10, 60, 100); //几何体
const material = new THREE.MeshLambertMaterial(); //材质
const mesh = new THREE.Mesh(geometry, material); //网格模型
mesh.position.set(0, 10, 0); //网格模型位置
// scene.add(mesh); //场景添加网格模型

// 3d半圆扩散 + 扩散波
let circle3D = scatter3DCircle(50);
circle3D.layers.enable(1);
circle3D.position.set(0, 10, 0);
scene.add(circle3D);

// AxesHelper
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 光源
const pointLight = new THREE.DirectionalLight(0xff00ff, 1.0); //颜色、强度
pointLight.position.set(200, 300, 400); //位置
scene.add(pointLight); //点光源添加到场景中

// 光源参考线
const dirLightHelper = new THREE.DirectionalLightHelper(
  pointLight,
  5,
  0xff0000
);
scene.add(dirLightHelper);

// 相机
const camera = new THREE.PerspectiveCamera(); //相机
camera.position.set(200, 200, 200); //相机位置
camera.lookAt(0, 10, 0); //相机观察位置

// 渲染器
const renderer = new THREE.WebGLRenderer(); // 创建渲染器

renderer.setSize(window.innerWidth, window.innerHeight); //渲染区域
renderer.render(scene, camera); //执行渲染
document.body.appendChild(renderer.domElement);

// 设置相机控件轨道控制器OrbitControls
new OrbitControls(camera, renderer
```

