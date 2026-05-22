---
title: "三维转屏幕坐标 - Three.js 案例讲解"
description: "Three.js Scene/Camera/Renderer 基础搭建。主流程在 `updateCSS2DVisibility`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,三维转屏幕坐标,基础案例"
outline: deep
---

# 三维转屏幕坐标

*Screen Coord*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=screenCoord)


![三维转屏幕坐标](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/screenCoord.jpg)


## 效果说明

Three.js Scene/Camera/Renderer 基础搭建。主流程在 `updateCSS2DVisibility`、`animate`。

> 基础案例 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

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

        const screenY = (-worldPosition.y + 1) 
```

