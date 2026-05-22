---
title: "颗粒图像 - Three.js 案例讲解"
description: "Three.js 片元/顶点着色器改颜色与形变。主流程在 `bezier`。"
head:
  - - meta
    - name: keywords
      content: "three.js,颗粒图像"
outline: deep
---

# 颗粒图像

*Image Part*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=imageParticle)


![颗粒图像](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/imageParticle.jpg)


## 效果说明

Three.js 片元/顶点着色器改颜色与形变。主流程在 `bezier`。

> 着色器 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 创建渲染器对象
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 设置像素比
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

// 创建场景对象
var scene = new THREE.Scene();
scene.background = new THREE.Color("#347897");

// 创建相机
const far = 500000;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, far);
camera.position.set(0, 0, 300);

// 点光源
var point = new THREE.PointLight("#fff", 1);
point.position.set(140, 200, 300); // 点光源位置
scene.add(point); // 点光源添加到场景中

// 环境光
var ambient = new THREE.AmbientLight("#fff", 2);
scene.add(ambient);

// 添加辅助线
const axisHelper = new THREE.AxesHelper(500);
scene.add(axisHelper);

// 创建控制器
const controls = new OrbitControls(camera, renderer.domElement);
//controls.autoRotate = true;

// 渲染
requestAnimationFrame(function render() {
    requestAnimationFrame(render);
    controls.update(); // Update controls
    renderer.render(scene, camera);
});

// 创建几何体
const width = 200; // 宽度
const height = 100; // 高度
const positionArr = []; // 顶点
const normalArr = []; // 法线
const uvArr = []; // uv
const geometry = new THREE.PlaneGeometry(width, height, 1 * w
```

