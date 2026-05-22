---
title: "轨道控制器 - Three.js 案例讲解"
description: "本案例展示 **轨道控制器** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环、GUI 面板调试参数。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,轨道控制器"
outline: deep
---
# 轨道控制器

*Orbit Controls*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=orbControls)

![轨道控制器](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/orbControls.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **轨道控制器** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环、GUI 面板调试参数。

> 基础案例 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 1, 4)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const geomerty = new THREE.PlaneGeometry(1, 1)

const map = new THREE.TextureLoader().load(HOST + 'files/author/KallkaGo.jpg')

const material = new THREE.MeshBasicMaterial({ map , color: 0xf2f2f2, side: THREE.DoubleSide })

const mesh = new THREE.Mesh(geomerty, material)

scene.add(mesh)

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

scene.add(new THREE.AxesHelper(10), new THREE.GridHelper(10, 10))

const folder = new GUI()

folder.add(controls, 'autoRotate').name('自动旋转')

folder.add(controls, 'autoRotateSpeed').name('自动旋转速度')

folder.add(controls, 'enableDamping').name('阻尼')

folder.add(controls, 'dampingFactor').name('阻尼系数').min(0).max(1)

folder.add(controls, 'minDistance').name('最小距离')

folder.add(controls, 'maxDistance').name('最大距离')

folder.add(controls, 'maxAzimuthAngle', -2 * Math.PI, Math.PI * 2).name('水平旋转上限')

folder.add(controls, 'minAzimuthAngle', -2 * Math.PI, Math.PI * 2).name('水平旋转下限')

folder.add(controls, 'maxPolarAngle', 0, Math.PI).name('垂直旋转上限')

folder.add(controls, 'minPolarAngle', 0, Math.PI).name('垂直旋转下限')

folder.add(controls, 'maxTargetRadius').name('目标移动上限')

folder.add(controls, 'minTargetRadius').name('目标移动下限')

folder.add(controls, 'enablePan').name('平移')

folder.add(controls, 'panSpeed').name('平移速度')

folder.add(controls, 'enableRotate').name('旋转')

folder.add(controls, 'rotateSpeed').name('旋转速度')

folder.add(controls, 'enableZoom').name('缩放')

folder.add(controls, 'zoomSpeed').name('缩放速度')

folder.add(controls, 'zoomToCursor').name('光标为缩放中心')

folder.add(controls.target, 'x').name('目标位置x').listen()

folder.add(controls.target, 'y').name('目标位置y').listen()

folder.add(controls.target, 'z').name('目标位置z').listen()

folder.add({ '重置': () => folder.reset()}, '重置')
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=orbControls) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
