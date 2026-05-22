---
title: "视频地板 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,视频地板"
outline: deep
---
# 视频地板

*Video Floor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=videoFloor)

![视频地板](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/videoFloor.jpg)

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

- **`createVideoPlane()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = url
    video.loop = true
    video.muted = true
    video.play()
    const texture = new THREE.VideoTexture(video)
    const geometry = new THREE.PlaneGeometry(width, height)

    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff * Math.random(), // 随机颜色
        alphaMap: texture,
        opecity: 0.5, // 透明度，可调整
        transparent: true,
        side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(0, positionY, 0) // 设置位置
    scene.add(mesh)
}

createVideoPlane(FILE_HOST + 'files/video/c1.mp4', 3, 3 , 0.01)
createVideoPlane(FILE_HOST + 'files/video/c2.mp4', 4, 4, 0)
createVideoPlane(FILE_HOST + 'files/video/c3.mp4', 5, 5, -0.01)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=videoFloor) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
