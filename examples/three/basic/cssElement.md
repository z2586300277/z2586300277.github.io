---
title: "CSS元素 - Three.js 案例讲解"
description: "Three.js Scene/Camera/Renderer 基础搭建。主流程在 `animate`、`createDom`。"
head:
  - - meta
    - name: keywords
      content: "three.js,CSS元素"
outline: deep
---

# CSS元素

*CSS Element*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cssElement)


![CSS元素](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/cssElement.jpg)


## 效果说明

Three.js Scene/Camera/Renderer 基础搭建。主流程在 `animate`、`createDom`。

> 基础案例 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- css2d渲染
- css3d 渲染

## 独立函数

- `animate()` — rAF：update controls + render

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

    setCss3dDOM(createDom('3D' + i), { x: 0, y: i * 2, z: 0 })
```

### css2d渲染

```js
function setCss2DRenderer(DOM) {

    const css2DRender = new CSS2DRenderer()

    css2DRender.resize = () => {

        css2DRender.setSize(DOM.clientWidth, DOM.clientHeight)

        css2DRender.domElement.style.zIndex = 0

        css2DRender.domElement.style.position = 'relative'

        css2DRender.domElement.style.top = -DOM.clientHeight * 2 + 'px'

        css2DRender.domElement.style.height = DOM.clientHeight + 'px'

        css2DRender.domElement.style.width = DOM.clientWidth + 'px'

        css2DRender.domElement.style.pointerEvents = 'none'

    }

    css2DRender.resize()

    DOM.appendChild(css2DRender.domElement)

    return css2DRender

}
```

### css3d 渲染

```js
function setCss3DRenderer(DOM) {

    const css3DRender = new CSS3DRenderer()

    css3DRender.resize = () => {

        css3DRender.setSize(DOM.clientWidth, DOM.clientHeight)

        css3DRender.domElement.style.zIndex = 0

        css3DRender.domElement.style.position = 'relative'

        css3DRender.domElement.style.top = -DOM.clientHeight + 'px'

        css3DRender.domElement.style.height = DOM.clientHeight + 'px'

        css3DRender.domElement.style.width = DOM.clientWidth + 'px'

        css3DRender.domElement.style.pointerEvents = 'none'

    }

    css3DRender.resize()

    DOM.appendChild(css3DRender.domElement)

    return css3DRender

}
```

