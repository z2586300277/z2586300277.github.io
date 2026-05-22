---
title: "分级地图 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `setScene`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,分级地图,扩展功能"
outline: deep
---

# 分级地图

*Area Map*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=areaMap)


![分级地图](https://z2586300277.github.io/three-cesium-examples/threeExamples/other/levelMap.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `setScene`、`animate`。

> 扩展功能 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render
- `animateTexture()` — 材质 / GLSL
- `createGeo()` — 材质 / GLSL
- `coordToVector()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import gsap from 'gsap'

const PAEAMS = { DEPTH: 15, coordsMaxCounts: 500 }
const fetchJson = (url) => fetch(url).then((res) => res.json())

setScene(document.getElementById('box'))

async function setScene(DOM) {

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, DOM.clientWidth / DOM.clientHeight, 0.1, 100000000)
    camera.position.set(0, 600, 300)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
    renderer.setSize(DOM.clientWidth, DOM.clientHeight)
    DOM.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(100, 100, 100)
    scene.add(new THREE.AmbientLight(0xffffff, 1.5), light)
    const css2DRender = new CSS2DRenderer()
    css2DRender.setSize(DOM.clientWidth, DOM.clientHeight)
    css2DRender.domElement.style.zIndex = 0
    css2DRender.domElement.style.position = 'relative'
    css2DRender.domElement.style.top = -DOM.clientHeight + 'px'
    css2DRender.domElement.style.height = DOM.client
```

