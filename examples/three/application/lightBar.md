---
title: "光柱 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`createLightBar`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,光柱,应用场景"
outline: deep
---

# 光柱

*Light Bar*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lightBar)


![光柱](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lightBar.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`createLightBar`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render
- `createLightBar()` — 材质 / GLSL

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

    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0
```

