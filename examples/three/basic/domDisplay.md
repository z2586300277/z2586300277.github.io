---
title: "DOM遮挡 - Three.js 案例讲解"
description: "Three.js Scene/Camera/Renderer 基础搭建。主流程在 `createRender`、`createDom`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,DOM遮挡,基础案例"
outline: deep
---

# DOM遮挡

*DOM Display*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=domDisplay)


![DOM遮挡](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/domDisplay.jpg)


## 效果说明

Three.js Scene/Camera/Renderer 基础搭建。主流程在 `createRender`、`createDom`。

> 基础案例 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- css3d 渲染

## 独立函数

- `animate()` — rAF：update controls + render

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

    const intersects = rayc
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

animate()

function animate() {

    meshs.forEach(mesh => { mesh.rotation.y += 0.01; mesh.rotation.x += 0.01 })

    list.forEach(mesh => mesh.update())

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

    css3DRender.render(scene, camera) 

}

window.onresize = () => {

    renderer.setSize(DOM.clientWidth, DOM.clientHeight)

    camera.aspect = DOM.clientWidth / DOM.clientHeight

    camera.updateProjectionMatrix()

    css3DRender.resize()

}
```

