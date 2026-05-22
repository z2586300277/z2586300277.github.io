---
title: "简单3d拓扑图 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,简单3d拓扑图"
outline: deep
---
# 简单3d拓扑图

*3D Topology*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=topology)

![简单3d拓扑图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/topology.jpg)

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

- **`createContainerNode()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createBoxNode()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createFlowLine()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`getDirectionQuaternion()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 40, 40)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio * 2) // 像素比
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

animate()
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}

scene.add(new THREE.AxesHelper(200))

const arr = [
    { id: 1, name: '电脑', color: 0x38c9d8, level: 1, coord: [0, 0], line: [2, 3, 4, 5, 13], icon: HOST + '/files/author/z2586300277.png' },
    { id: 2, name: '主机', level: 1, color: 0x3021c1, coord: [2, 1], line: [6, 7, 8, 9, 10, 11], icon: HOST + '/files/author/z2586300277.png' },
    { id: 3, name: '显示器', level: 1, color: 0x3021c1, coord: [2, 2], line: [9], icon: HOST + '/files/author/KallkaGo.jpg' },
    { id: 4, name: '键盘', level: 1, color: 0x3021c1, coord: [2, -2], line: [6], icon: HOST + '/files/author/z2586300277.png' },
    { id: 5, name: '鼠标', level: 1, color: 0x3021c1, coord: [2, 3], line: [], icon: HOST + '/files/author/z2586300277.png' },
    { id: 6, name: '主板', level: 1, color: 0xffe0a1, coord: [4, -1], line: [], icon: HOST + '/files/author/flowers-10.jpg' },
    { id: 7, name: '硬盘', level: 1, color: 0xffe0a1, coord: [4, -2], line: [], icon: HOST + '/files/author/flowers-10.jpg' },
    { id: 8, name: '显卡', level: 1, color: 0xffe0a1, coord: [4, -3], line: [], icon: HOST + '/files/author/flowers-10.jpg' },
    { id: 9, name: '屏幕', level: 1, color: 0xffe0a1, coord: [4, 2], line: [], icon: HOST + '/files/author/flowers-10.jpg' },
    { id: 10, name: 'CPU', level: 1, color: 0xffe0a1, coord: [4, 1], line: [], icon: HOST + '/files/author/flowers-10.jpg' },
    { id: 11, name: '内存条', level: 1, color: 0xffe0a1, coord: [4, 0], line: [12], icon: HOST + '/files/author/flowers-10.jpg' },
    { id: 12, name: '测试', level: 1, color: 'pink', coord: [6, 0], line: [], icon: HOST + '/files/author/flowers-10.jpg' },
    { id: 13, name: '测试', level: 2, color: 'pink', coord: [7, 5], line: [], icon: HOST + '/files/author/KallkaGo.jpg' },
]

const arr2 = [
    [2, 3, 5],
    [6, 7, 8, 9, 10, 11]
]

const options = { xzScale: 10, meshScale: 5, flowDirection: 'right', fontSize: 1.5, textHeight: 0 }
const { xzScale, meshScale } = options

// 创建组
const group = new THREE.Group()
group.position.set(0, 10, 0)
group.rotation.x += Math.PI / 2
scene.add(group);

// 网格辅助  
const grid = new THREE.GridHelper(20 * xzScale, xzScale, '#fff', 0xffffff)
group.add(grid)
grid.material.opacity = 0.5
grid.material.transparent = true

// 遍历节点 
const boxArr = arr.map((i, k) => {
    const box = createBoxNode(meshScale, xzScale, i)
    group.add(box)
    return box
})

// 创建连接线
boxArr.forEach((i, k) => {
    const { line } = i.info
    line.map((id, z) => {
        const mesh = boxArr.find(j => j.info.id === id)
        if (mesh) try {
            const flowLine = createFlowLine(i.position, mesh.position, { ...options, radius: 0.1, color: i.info.color })
            group.add(flowLine)
        } catch (e) { }
    })
})

// 创建容器
arr2.forEach((i, k) => {
    const positions = i.map(j => boxArr.find(z => z.info.id === j).position)
    const mesh = createContainerNode(positions, meshScale)
    group.add(mesh)
})

/* 创建容器 */
function createContainerNode(positions, meshScale) {
    const max = ['x', 'y', 'z'].map(i => Math.max(...positions.map(j => j[i])))
    const min = ['x', 'y', 'z'].map(i => Math.min(...positions.map(j => j[i])))
    const [width, height, depth] = max.map((i, k) => Math.abs(i - min[k])).map(i => i + meshScale * 2)
    const geometry = new THREE.BoxGeometry(width, height, depth)
    const material = new THREE.MeshBasicMaterial({ color: 'red', transparent: true, opacity: 0.2 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.renderOrder = 1
    mesh.position.set((max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2)
    return mesh
}

/* 创建立方体节点 */
function createBoxNode(meshScale, xzScale, i) {
    const { coord } = i
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(meshScale, meshScale, meshScale),
        new THREE.MeshBasicMaterial({ color: i.color || '' })
    )
    box.position.set(coord[0] * xzScale, 0, coord[1] * xzScale)
    box.info = i
    if (i.icon) {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(meshScale * 0.8, meshScale * 0.8),
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=topology) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
