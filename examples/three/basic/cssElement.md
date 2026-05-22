---
title: "CSS元素 - Three.js 案例讲解"
description: "本案例展示 **CSS元素** 的实现。涉及：相机交互控制器、CSS2D/3D 标签渲染、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,CSS元素"
outline: deep
---
# CSS元素

*CSS Element*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cssElement)

![CSS元素](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/cssElement.jpg)

## 你将学到什么

- 相机交互控制器
- CSS2D/3D 标签渲染
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **CSS元素** 的实现。涉及：相机交互控制器、CSS2D/3D 标签渲染、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- DOM 元素叠加在 3D 坐标上，适合信息面板（注意与 WebGL 深度关系）。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`createDom()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`setCss2DRenderer()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`setCss3DRenderer()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(500))

// Css3DOM
const css3DRender = setCss3DRenderer(DOM)

// Css2DOM
const css2DRender = setCss2DRenderer(DOM)

const setCss2dDOM = (DOM, position) => {

    DOM.style.pointerEvents = 'auto'

    const mesh = new CSS2DObject(DOM)

    mesh.position.copy(position)

    scene.add(mesh)

    return mesh

}

const setCss3dDOM = (DOM, position) => {

    const mesh = new CSS3DObject(DOM)

    mesh.position.copy(position)

    scene.add(mesh)

    return mesh

}

for (let i = 0; i < 5; i++) {

    setCss2dDOM(createDom('2D' + i), { x: 0, y: 0, z: i * 2 }) // 2d dom

    setCss3dDOM(createDom('3D' + i), { x: 0, y: i * 2, z: 0 }).scale.multiplyScalar(0.02) // 3d dom

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

    css3DRender.render(scene, camera) // Css3D渲染

    css2DRender.render(scene, camera) // Css2D渲染

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

    css3DRender.resize()

    css2DRender.resize()

}

// 创建dom
function createDom(text) {

    const div = document.createElement('div')

    const img = document.createElement('img')

    img.src = HOST + '/files/author/z2586300277.png'

    img.style.width = '50px'

    img.style.height = '50px'

    div.appendChild(img)

    div.innerHTML += text

    div.style.color = 'white'

    return div

}

/* css2d渲染 */
function setCss2DRenderer(DOM) {

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cssElement) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
