---
title: "自定义网格 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,自定义网格,应用场景"
outline: deep
---

# 自定义网格

*Custom Grid*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=customGrid)


![自定义网格](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/customGrid.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

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

camera.position.set(0, 0, 16)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setClearColor(0xffffff, 1)

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const width = 10, height = 10 // 宽度和高度

const dx = 1, dy = 1 // 网格间隔

const colorA = new THREE.Color(0xaaaaaa), colorB = new THREE.Color(0xdfdfdf) // 网格颜色

const vertices = [], colors = [] // 顶点和颜色

// 生成网格顶点和颜色
for (let i = -width / 2; i <= width / 2; i += dx) {

    vertices.push(i, -height / 2, 0, i, height / 2, 0) // 水平线

    const color = (i === 0) ? colorA : colorB // 颜色

    co
```

