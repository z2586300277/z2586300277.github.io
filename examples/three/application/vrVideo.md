---
title: "VR 全景视频 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,VR 全景视频,应用场景"
outline: deep
---

# VR 全景视频

*VR Video*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=vrVideo)


![VR 全景视频](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/vrVideo.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`。

> 应用场景 · Three.js

## 实现思路

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

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(2, 2, 2)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setPixelRatio(window.devicePixelRatio * 1.5)

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const video = document.createElement('video')
video.crossOrigin = 'anonymous'
video.src = FILE_HOST + 'video/vr.mp4'
video.loop = true
video.muted = true
video.play()

const texture = new THREE.VideoTexture(video)
const geometry = new THREE.SphereGeometry(100, 64, 32)

const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

animate()

function animate() {

    controls.update()

    mesh.rotation.y += 0.001

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    c
```

