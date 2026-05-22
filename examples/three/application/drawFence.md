---
title: "绘制围栏 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,绘制围栏"
outline: deep
---
# 绘制围栏

*Draw Fence*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=drawFence)

![绘制围栏](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/drawFence.jpg)

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

- **`multShapeGroup()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`multShapePlaneGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`updateMultShapePlaneGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 3, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const plane = new THREE.PlaneGeometry(5, 5)

const material = new THREE.MeshBasicMaterial({ color: 'gray' })

const planeMesh = new THREE.Mesh(plane, material)

planeMesh.rotation.x -= Math.PI / 2

scene.add(planeMesh)

const texture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/wall_g.png')

texture.wrapT = THREE.RepeatWrapping

texture.repeat.y = 15

animate()

function animate() {

    texture.offset.y -= 0.005;

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

// 事件
const raycaster = new THREE.Raycaster()

const getPoint = event => {

    const mouse = new THREE.Vector2((event.offsetX / event.target.clientWidth) * 2 - 1, -(event.offsetY / event.target.clientHeight) * 2 + 1)

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) return intersects[0].point

}

/* 开始绘制 */
const pointList = []; let drawMesh = null; let fenceHeight = 1

box.addEventListener('click', (event) => {

    const point = getPoint(event)

    if (!point) return

    point.y += 0.001

    pointList.push(point)

    if (pointList.length < 2) return

    const formatPoints = pointList.reduce((i, j) => {

        const k = new THREE.Vector3().copy(j)

        k.y += fenceHeight

        return [...i, k, j]

    }, [])

    const { indexGroup, faceGroup, uvGroup } = multShapeGroup(formatPoints)

    if (!drawMesh) {

        const geometry = multShapePlaneGeometry(faceGroup, indexGroup, uvGroup)

        const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: texture, transparent: true, color: Math.random() * 0xffffff })

        drawMesh = new THREE.Mesh(geometry, material)

        scene.add(drawMesh)

    }

    else updateMultShapePlaneGeometry(drawMesh.geometry, faceGroup, indexGroup, uvGroup)

})

/* 处理顶点算法 */
function multShapeGroup(formatPoints) {

    const { length } = formatPoints

    const indexGroup = formatPoints.map((_, k) => (k - 1 > -1 && k + 1 < length) && (k % 2 === 0 ? [k, k + 1, k - 1] : [k, k - 1, k + 1])).filter((i) => i).reduce((i, j) => [...i, ...j], [])

    const faceGroup = formatPoints.reduce((j, i) => [...j, i.x, i.y, i.z], [])

    const uvMaxMin = formatPoints.reduce((p, i) => ({ x: [...p['x'], i['x']], y: [...p['y'], i['y']], z: [...p['z'], i['z']] }), { x: [], y: [], z: [] })

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=drawFence) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
