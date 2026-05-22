---
title: "绘制围栏 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`multShapeGroup`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,绘制围栏,应用场景"
outline: deep
---

# 绘制围栏

*Draw Fence*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=drawFence)


![绘制围栏](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/drawFence.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`multShapeGroup`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 开始绘制
- 处理顶点算法
- 根据顶点组生成物体
- 更新顶点

## 独立函数

- `animate()` — rAF：update controls + render

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

    const mouse = new THREE.Vector2((event.offsetX / event.target.clientWidth) * 2 - 1, -(event.offsetY / event.target.clientHeigh
```

### 开始绘制

```js
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
```

### 处理顶点算法

```js
function multShapeGroup(formatPoints) {

    const { length } = formatPoints

    const indexGroup = formatPoints.map((_, k) => (k - 1 > -1 && k + 1 < length) && (k % 2 === 0 ? [k, k + 1, k - 1] : [k, k - 1, k + 1])).filter((i) => i).reduce((i, j) => [...i, ...j], [])

    const faceGroup = formatPoints.reduce((j, i) => [...j, i.x, i.y, i.z], [])

    const uvMaxMin = formatPoints.reduce((p, i) => ({ x: [...p['x'], i['x']], y: [...p['y'], i['y']], z: [...p['z'], i['z']] }), { x: [], y: [], z: [] })

    const Maxp = new THREE.Vector3(Math.max(...uvMaxMin.x), Math.max(...uvMaxMin.y), Math.max(...uvMaxMin.z))  // 最大点

    const Minp = new THREE.Vector3(Math.min(...uvMaxMin.x), Math.min(...uvMaxMin.y), Math.min(...uvMaxMin.z))  // 最小点

    const W = Maxp.x - Minp.x

    const H = Maxp.y - Minp.y

    const L = W > H ? W : H

    const uvGroup = formatPoints.map(i => new THREE.Vector2((i.x - Minp.x) / L, (i.y - Minp.y) / L)).reduce((i, j) => [...i, ...j], [])

    return { indexGroup, faceGroup, uvGroup }

}
```

