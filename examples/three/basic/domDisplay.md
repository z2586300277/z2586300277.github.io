---
title: "DOM遮挡 - Three.js 案例讲解"
description: "本案例展示 **DOM遮挡** 的实现。涉及：相机交互控制器、CSS2D/3D 标签渲染、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,DOM遮挡"
outline: deep
---
# DOM遮挡

*DOM Display*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=domDisplay)

![DOM遮挡](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/domDisplay.jpg)

## 你将学到什么

- 相机交互控制器
- CSS2D/3D 标签渲染
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **DOM遮挡** 的实现。涉及：相机交互控制器、CSS2D/3D 标签渲染、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- DOM 元素叠加在 3D 坐标上，适合信息面板（注意与 WebGL 深度关系）。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`createRender()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createDom()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`setCss3DRenderer()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(20, 20, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add( new THREE.GridHelper(50, 10))

const css3DRender = setCss3DRenderer(DOM)

const setCss3dDOM = (div, position) => {

    const mesh = new CSS3DObject(div)

    div.style.pointerEvents = 'none'

    mesh.div = div

    mesh.position.copy(position)

    scene.add(mesh)

    return mesh

}

const R = () => Math.random() * 20 - 10

const list = []

const meshs = []

function createRender(mesh) {

    const direction = new THREE.Vector3().subVectors(mesh.position, camera.position).normalize()

    const raycaster = new THREE.Raycaster(camera.position, direction, 0, mesh.position.distanceTo(camera.position))

    const intersects = raycaster.intersectObjects(meshs)

    mesh.div.style.opacity = intersects.length > 0 ? 0 : 1

}

for (let i = 0; i < 100; i++) {

    const mesh = setCss3dDOM(createDom('顽皮宝' + i), { x: R(), y: R(), z: R() })

    mesh.scale.multiplyScalar(0.02)

    mesh.lookAt(R(), R(), R())

    mesh.update = () => createRender(mesh)

    list.push(mesh)

    if (i % 40 === 0) {

        const boxGeometry = new THREE.TorusKnotGeometry( 4, 0.6, 100, 16 )

        const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff , transparent: true, opacity: 0.45 }))

        boxMesh.position.copy({ x: R(), y: R(), z: R() })

        meshs.push(boxMesh)

        scene.add(boxMesh)

    }

}

// 创建dom
function createDom(text) {

    const div = document.createElement('div')

    div.style.position = 'absolute'

    div.style.transition = 'all 0.2s'

    const img = document.createElement('img')

    img.src = HOST + '/files/author/flowers-10.jpg'

    img.style.width = '50px'

    img.style.height = '50px'

    div.appendChild(img)

    div.innerHTML += text

    div.style.color = 'white'

    document.body.appendChild(div)

    return div

}

/* css3d 渲染 */
function setCss3DRenderer(DOM) {

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=domDisplay) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
