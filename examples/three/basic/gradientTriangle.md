---
title: "渐变三角形 - Three.js 案例讲解"
description: "Three.js Scene/Camera/Renderer 基础搭建。主流程在 `initObject`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,渐变三角形"
outline: deep
---

# 渐变三角形

*Triangle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=gradientTriangle)


![渐变三角形](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/gradientTriangle.jpg)


## 效果说明

Three.js Scene/Camera/Renderer 基础搭建。主流程在 `initObject`、`animate`。

> 基础案例 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 500)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

box.appendChild(renderer.domElement)

initObject();
function initObject() {
  let geometry = new THREE.BufferGeometry(); // 使用BufferGeometry

  let vertices = new Float32Array([
    0, 0, 0, // 顶点p1
    0, 200, 0, // 顶点p2
    200, 0, 0 // 顶点p3
  ]);

  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

  let colors = [
    1.0, 0.0, 0.0, // 颜色1 (红色)
    0.0, 1.0, 0.0, // 颜色2 (绿色)
    0.0, 0.0, 1.0  // 颜色3 (蓝色)
  ];

  // 创建顶点颜色属性
  let colorAttribute = new THREE.BufferAttribute(new Float32Array(colors), 3);
  geometry.setAttribute('color', colorAttribute);

  // 定义索引，创建三角形面
  let indices = [
    0, 1, 2 // 索引0, 1, 2 表示顶点数组中的p1, p2, p3
  ];
  let indexAttribute = new THREE.BufferA
```

