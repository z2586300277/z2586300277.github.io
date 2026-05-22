---
title: "自定义网格 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,自定义网格"
outline: deep
---
# 自定义网格

*Custom Grid*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=customGrid)

![自定义网格](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/customGrid.jpg)

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

    colors.push(...Array(2).fill(color.toArray()).flat())

}

// 垂直线
for (let j = -height / 2; j <= height / 2; j += dy) {

    vertices.push(-width / 2, j, 0, width / 2, j, 0) // 垂直线

    const color = (j === 0) ? colorA : colorB // 颜色

    colors.push(...Array(2).fill(color.toArray()).flat())
    
}

// 创建 BufferGeometry 和材质
const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

const material = new THREE.LineBasicMaterial({ vertexColors: true })

const grid = new THREE.LineSegments(geometry, material)

scene.add(grid)
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=customGrid) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
