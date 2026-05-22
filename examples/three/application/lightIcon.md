---
title: "亮光标记 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,亮光标记"
outline: deep
---
# 亮光标记

*Light Icon*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lightIcon)

![亮光标记](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/lightIcon.jpg)

## 你将学到什么

- 相机交互控制器
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

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
const lightPillarGeometry = new THREE.PlaneGeometry(3, 20)
const lightPillarMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: lightPillarTexture,
    alphaMap: lightPillarTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
})
const lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial)
lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2))
circleMesh.position.set(0, -10, 0)

lightPillar.add(circleMesh)
scene.add(lightPillar)

animate()
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=lightIcon) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
