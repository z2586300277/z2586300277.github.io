---
title: "三维转屏幕坐标 - Three.js 案例讲解"
description: "本案例展示 **三维转屏幕坐标** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,三维转屏幕坐标"
outline: deep
---
# 三维转屏幕坐标

*Screen Coord*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=screenCoord)

![三维转屏幕坐标](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/screenCoord.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **三维转屏幕坐标** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`updateCSS2DVisibility()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createDom()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(50))

const R = () => Math.random() * 10 - 5

const list = []

for (let i = 0; i < 30; i++) {

    const div = createDom('D' + i)

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }))

    mesh.position.set(R(), R(), R())

    scene.add(mesh)

    mesh.div = div

    list.push(mesh)

}

function updateCSS2DVisibility() {

    list.forEach(mesh => {

        const worldPosition = mesh.getWorldPosition(new THREE.Vector3())

        worldPosition.project(camera);

        const width = renderer.domElement.clientWidth

        const height = renderer.domElement.clientHeight

        const screenX = (worldPosition.x + 1) / 2 * width

        const screenY = (-worldPosition.y + 1) / 2 * height

        mesh.div.style.left = screenX + 'px'

        mesh.div.style.top = screenY + 'px'
      
    })

}

animate()

function animate() {

    requestAnimationFrame(animate)

    updateCSS2DVisibility()

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// 创建dom
function createDom(text) {

    const div = document.createElement('div')

    div.style.position = 'absolute'

    const img = document.createElement('img')

    img.src = HOST + '/files/author/KallkaGo.jpg'

    img.style.width = '50px'

    img.style.height = '50px'

    div.appendChild(img)

    div.innerHTML += text

    div.style.color = 'white'

    document.body.appendChild(div)

    return div

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=screenCoord) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
