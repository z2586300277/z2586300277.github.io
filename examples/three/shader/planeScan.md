---
title: "平面扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,平面扫描,着色器"
outline: deep
---

# 平面扫描

*Plane Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=planeScan)


![平面扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/planeScan.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 2, 2)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.outputColorSpace = THREE.LinearSRGBColorSpace 

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const plane = new THREE.PlaneGeometry(5,5)

const map = new THREE.TextureLoader().load('https://z2586300277.github.io/three-editor/dist/files/channels/texture.jpg')

const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, map , transparent: true })

const mesh = new THREE.Mesh(plane, material)

const uniforms = {

    innerCircleWidth: { value: 0.59, type: 'number', unit: 'float' },

    circleWidth: { value: 0.2, type: 'number', unit: 'float' },

    circleMax: { value: 0.7, type: 'number', unit: 'float' },

    opacityScale: { value: 0.8, type: 'number', unit: 'float' },

    reverseOpacity: { value: false, type: 'bool', unit: 'bool' },

    circleSpeed:
```

