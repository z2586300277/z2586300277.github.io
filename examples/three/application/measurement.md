---
title: "测量 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `createRuler`、`createText`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,测量,应用场景"
outline: deep
---

# 测量

*Measurement*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=measurement)


![测量](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/measurement.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `createRuler`、`createText`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `createRuler()` — 材质 / GLSL
- `createText()` — 材质 / GLSL
- `createArrowMeasure()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

renderer.setClearColor(0xffffff, 1)

renderer.setPixelRatio(window.devicePixelRatio * 1.6)

new OrbitControls(camera, renderer.domElement)

// 创建简单尺子
createRuler()

// 创建箭头测量线
createArrowMeasure()

animate()

function createRuler() {

    const start = new THREE.Vector3(-10, 0, 0)
    const end = new THREE.Vector3(10, 0, 0)
    const distance = start.distanceTo(end)
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end])
    const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: 0x000000 }))
    scene.add(line)
    
    for (let i = 0; i <= 20; i++) {
        const t = i / 20
        const pos = new THREE.Vector3().lerpVectors(start, end, t)
        const height = i % 5 === 0 ? 1 : 0.5
        
        const tickGeometry = new THREE.BufferGeometry().setFromPoints([
            n
```

