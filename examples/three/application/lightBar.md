---
title: "光柱 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,光柱"
outline: deep
---
# 光柱

*Light Bar*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lightBar)

![光柱](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lightBar.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`createLightBar()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.5), new THREE.AxesHelper(100))

// 随机创建光柱
for (let i = 0; i < 10; i++) {

    const lightBar = createLightBar(0xffffff * Math.random())

    lightBar.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5)

    scene.add(lightBar)

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

function createLightBar(color = 0xfcde8c) {
    // 创建mesh
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 6)

    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3, side: THREE.DoubleSide })

    const mesh = new THREE.Mesh(geometry, material)

    material.blending = THREE.AdditiveBlending

    // 创建纹理
    const texture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/lightMap.png')

    texture.wrapS = THREE.RepeatWrapping

    texture.wrapT = THREE.RepeatWrapping

    // 创建平面
    const plane = new THREE.PlaneGeometry(1.5, 10)

    const planeMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.3, side: THREE.DoubleSide, map: texture })

    planeMaterial.blending = THREE.AdditiveBlending

    planeMaterial.depthTest = false

    const planeMesh = new THREE.Mesh(plane, planeMaterial)

    const planeMesh2 = planeMesh.clone()

    planeMesh2.rotation.y = Math.PI / 3

    const planeMesh3 = planeMesh.clone()

    planeMesh3.rotation.y = -Math.PI / 3

    mesh.add(planeMesh3)

    mesh.add(planeMesh)

    mesh.add(planeMesh2)

    // 创建group
    const group = new THREE.Group()

    group.RootMaterials = [material, planeMaterial]

    group.add(mesh)

    return group

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lightBar) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
