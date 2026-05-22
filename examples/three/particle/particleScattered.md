---
title: "粒子聚散 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `animate`、`createParticleAnimation1`。"
head:
  - - meta
    - name: keywords
      content: "three.js,粒子聚散"
outline: deep
---

# 粒子聚散

*Scattered*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleScattered)


![粒子聚散](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleScattered.jpg)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `animate`、`createParticleAnimation1`。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `animate()` — rAF：update controls + render
- `createParticleAnimation2()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as TWEEN from "@tweenjs/tween.js";

const DOM = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)
camera.position.set(5, 5, 12)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
DOM.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.01

window.onresize = () => {
    renderer.setSize(DOM.clientWidth, DOM.clientHeight)
    camera.aspect = DOM.clientWidth / DOM.clientHeight
    camera.updateProjectionMatrix()
}

scene.add(new THREE.AxesHelper(1000))

let particles = null
let particleSystem = null;
animate()
createParticleAnimation1()
createParticleAnimation2()

function animate() {
    controls.update()
    TWEEN.update();
    particleSystem && (particleSystem.rotation.y += 0.2)
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function createParticleAnimation1() {
    // 创建粒子
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Ar
```

