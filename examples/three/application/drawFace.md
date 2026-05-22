---
title: "绘制面 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`multShapeGroup`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,绘制面,应用场景"
outline: deep
---

# 绘制面

*Draw Face*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=drawFace)


![绘制面](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/drawFace.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`multShapeGroup`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 增加一个面
- 开始绘制
- 处理顶点算法
- 根据顶点组生成物体

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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

directionalLight.position.set(0, 20, 0)

scene.add(directionalLight, new THREE.AmbientLight(0xffffff, 1))
```

### 增加一个面

```js
const plane = new THREE.PlaneGeometry(5, 5)

const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

const planeMesh = new THREE.Mesh(plane, material)

planeMesh.rotation.x -= Math.PI / 2

scene.add(planeMesh)

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

// 事件
const raycaster = new THREE.Raycaster()

const getPoint = event => {

  const mouse = new THREE.Vector2(

    (event.offsetX / event.target.clientWidth) * 2 - 1,

    -(event.offsetY / event.target.clientHeight) * 2 + 1

  )

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) return intersects[0].point

}

const setPointBox = point => {

  const box = new THREE.BoxGeometry(0.04, 0.04, 0.04)

  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })

  const boxMesh = new THREE.Mesh(box, material)

  boxMesh.position.copy(point)

  scene.add(boxMesh)

}
```

### 开始绘制

```js
const pointList = []; let drawMesh = null; let stop = false

box.addEventListener('contextmenu', () => {

  stop = true

  const { indexGroup, faceGroup, uvGroup } = multShapeGroup(pointList)

  if (drawMesh) updateMultShapePlaneGeometry(drawMesh.geometry, faceGroup, indexGroup, uvGroup)

})

// 移动
box.addEventListener('mousemove', (event) => {

  if (stop) return

  const point = getPoint(event)

  if (!point || !drawMesh || pointList.length < 2) return

  const { indexGroup, faceGroup, uvGroup } = multShapeGroup([...pointList, point])

  updateMultShapePlaneGeometry(drawMesh.geometry, faceGroup, indexGroup, uvGroup)

})

box.addEventListener('click', (event) => {

  const point = getPoint(event)

  if (!point || stop) return

  setPointBox(point)

  point.y += 0.001

  pointList.push(point)

  const { indexGroup, faceGroup, uvGroup } = multShapeGroup(pointList)

  if (pointList.length < 3) return

  if (!drawMesh) {

    const geometry = multShapePlaneGeometry(faceGroup, indexGroup, uvGroup)

    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide })

    drawMesh = new THREE.Mesh(geometry, material)

    scene.add(drawMesh)

  }

  else updateMultShapePlaneGeometry(drawMesh.geometry, faceGroup, indexGroup, uvGroup)

})
```

