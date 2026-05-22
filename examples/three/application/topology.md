---
title: "简单3d拓扑图 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`createContainerNode`。"
head:
  - - meta
    - name: keywords
      content: "three.js,3d拓扑图"
outline: deep
---

# 简单3d拓扑图

*3D Topology*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=topology)


![简单3d拓扑图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/topology.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`createContainerNode`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 创建容器
- 创建立方体节点
- 创建流程线

## 独立函数

- `animate()` — rAF：update controls + render
- `createContainerNode()` — 材质 / GLSL
- `createBoxNode()` — 材质 / GLSL

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
    { id:
```

### 创建容器

```js
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
```

### 创建立方体节点

```js
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
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(i.icon) })
        )
        plane.position.set(0, 0, meshScale / 2 * 1.01)
        const plane2 = plane.clone()
        plane2.position.set(0, 0, -meshScale / 2 * 1.01)
        box.add(plane, plane2)
    }

    box.rotation.x += -Math.PI / 2
    return box
}
```

