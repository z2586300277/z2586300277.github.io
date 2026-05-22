---
title: "D3 svg与Three - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,D3 svg与Three,扩展功能"
outline: deep
---

# D3 svg与Three

*D3 SVG Three*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=d3Svg)


![D3 svg与Three](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/d3Svg.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `animate`。

> 扩展功能 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as d3 from "d3";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

animate()

function animate() {

  requestAnimationFrame(animate)

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

const data = await d3.json(FILE_HOST + "other/volcano.json");
const n = data.width;
const m = data.height;
const width = 928;
const height = Math.round(m / n * width);
const path = d3.geoPath().projection(d3.geoIdentity().scale(width / n));
const contours = d3.contours().size([n, m]);
const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.ext
```

