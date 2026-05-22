---
title: "精灵标签 - Three.js 案例讲解"
description: "Three.js Scene/Camera/Renderer 基础搭建。主流程在 `animate`、`setText`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,精灵标签,基础案例"
outline: deep
---

# 精灵标签

*Sprite Text*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=spriteTexture)


![精灵标签](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/spriteTexture.jpg)


## 效果说明

Three.js Scene/Camera/Renderer 基础搭建。主流程在 `animate`、`setText`。

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

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(2, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(100))

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const devicePixelRatio = window.devicePixelRatio * 4;
const logicalWidth = 124;
const logicalHeight = 164;

canvas.width = logicalWidth * devicePixelRatio;
canvas.height = logicalHeight * devicePixelRatio;
canvas.style.width = `${logicalWidth}px`;
canvas.style.height = `${logicalHeight}px`;

ctx.scal
```

