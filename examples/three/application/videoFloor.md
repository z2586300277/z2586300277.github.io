---
title: "视频地板 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`createVideoPlane`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,视频地板,应用场景"
outline: deep
---

# 视频地板

*Video Floor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=videoFloor)


![视频地板](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/videoFloor.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`createVideoPlane`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render
- `createVideoPlane()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(2, 2, 2)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setPixelRatio(window.devicePixelRatio * 1.5)

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

animate()

function animate() {

    controls.update()

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

async function createVideoPlane(url, width, height, positionY) {

    const video = docume
```

