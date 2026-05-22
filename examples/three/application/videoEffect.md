---
title: "视频碎片 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,视频碎片,应用场景"
outline: deep
---

# 视频碎片

*Video Effect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=videoEffect)


![视频碎片](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/videoEffect.jpg)


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

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const video = document.createElement('video')

video.crossOrigin = 'anonymous' // 跨域

video.src = 'https://z2586300277.github.io/3d-file-server/video/test.mp4'

video.loop = true // 循环播放

video.muted = true // 静音

video.play()

const texture = await new Promise(r => video.onloadeddata = () => r(new THREE.VideoTexture(video))) // 创建视频纹理

const group = new THREE.Group()
const config = {
    width: 16,
    height: 9,
    xGrid: 4,
    yGrid: 3,
    offset: 0.1
}
const ux = 1 / config.xGrid
const uy = 1 / config.yGrid
const planeWidth = config.width / config.xGrid - config.offset
const planeHeight = config.height / config.yGrid - config.offset
for (let i = 0; i < config.xGrid; i++) {
    for (let j = 0; j < config.yGrid; j++) {
        // 创
```

