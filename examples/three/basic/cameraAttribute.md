---
title: "相机属性 - Three.js 案例讲解"
description: "本案例展示 **相机属性** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环、GUI 面板调试参数。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,相机属性"
outline: deep
---
# 相机属性

*Camera*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cameraAttribute)

![相机属性](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/cameraAttribute.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **相机属性** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环、GUI 面板调试参数。

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

controls.enableDamping = true

const geomerty = new THREE.PlaneGeometry(1, 1)

const map = new THREE.TextureLoader().load(HOST + 'files/author/flowers-10.jpg')

const material = new THREE.MeshBasicMaterial({ map, color: 0x737373, side: THREE.DoubleSide })

const mesh = new THREE.Mesh(geomerty, material)

scene.add(mesh)

const box1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }))

box1.position.set(1, 1, 0)

box1.layers.set(1)

scene.add(box1)

animate()

function animate() {

  requestAnimationFrame(animate)

  box1.rotation.y += 0.01

  controls.update()

  renderer.render(scene, camera)

}

scene.add(new THREE.AxesHelper(10), new THREE.GridHelper(10, 10))

const folder = new GUI()

const onChange = () => camera.updateProjectionMatrix()

folder.add(camera.layers, 'mask').name('图层').onChange(onChange).listen()

folder.add({ '切换此图层的状态': () => camera.layers.toggle(1) }, '切换此图层的状态')

folder.add(camera, 'fov').min(0).name('视角').onChange(onChange)

folder.add(camera, 'near').min(0.001).name('近平面').onChange(onChange)

folder.add(camera, 'far').min(0).name('远平面').onChange(onChange)

folder.add(camera, 'zoom').min(0).name('缩放').onChange(onChange)

folder.add(camera, 'filmOffset').name('胶片偏移').onChange(onChange)

folder.add(camera, 'filmGauge').name('胶片尺寸').onChange(onChange)

folder.add(camera.position, 'x').name('相机位置x').listen()

folder.add(camera.position, 'y').name('相机位置y').listen()

folder.add(camera.position, 'z').name('相机位置z').listen()

folder.add({ fn: () => folder.reset() }, 'fn').name('重置')
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cameraAttribute) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
