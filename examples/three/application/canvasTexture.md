---
title: "Canvas贴图 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,Canvas贴图,应用场景"
outline: deep
---

# Canvas贴图

*Canvas Texture*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=canvasTexture)


![Canvas贴图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/canvasTexture.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as echarts from 'echarts'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const w = 800, h = 600
const container = document.createElement('canvas')
// 设置实际尺寸而不是CSS尺寸
container.width = w
container.height = h
// 保持CSS尺寸以便echarts正确初始化
container.style.width = w + "px"
container.style.height = h + "px"

const myChart = echarts.init(container, null, {
    devicePixelRatio: window.devicePixelRatio // 使用正确的设备像素比
})
const texture = new THREE.CanvasTexture(container)
// 设置贴图过滤模式以提高清晰度
texture.minFilter = THREE.LinearFilter
texture.magFilter = THREE.LinearFilter

// 计算保持纵横比的平面尺寸
const aspectRatio = w / h
const planeWidth = 4
const planeHeight = planeWidth / aspectRatio
const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent
```

