---
title: "亮光标记 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,亮光标记,应用场景"
outline: deep
---

# 亮光标记

*Light Icon*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lightIcon)


![亮光标记](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lightIcon.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import { Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, TextureLoader, WebGLRenderer } from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const size = { width: window.innerWidth, height: window.innerHeight }
const scene = new Scene()

const camera = new PerspectiveCamera(45, size.width / size.height, 0.1, 1000)
camera.position.set(30, 30, 30)

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const circlePlane = new PlaneGeometry(6, 6)
const circleTexture = new TextureLoader().load(FILE_HOST + 'images/channels/label.png')
const circleMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    map: circleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
})
const circleMesh = new Mesh(circlePlane, circleMaterial)
circleMesh.rotation.x = -Math.PI / 2
gsap.to(circleMesh.scale, {
    duration: 1 + Math.random() * 0.5,
    x: 1.5,
    y: 1.5,
    repeat: -1
})

const lightPillarTexture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/light_column.png')
const lightP
```

