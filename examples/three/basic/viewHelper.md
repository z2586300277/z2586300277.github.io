---
title: "视图辅助 - Three.js 案例讲解"
description: "本案例展示 **视图辅助** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,视图辅助"
outline: deep
---
# 视图辅助

*View Helper*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=viewHelper)

![视图辅助](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/viewHelper.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **视图辅助** 的实现。涉及：相机交互控制器、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(5), new THREE.GridHelper(10, 10))

const viewHelper = new ViewHelper(camera, renderer.domElement)

renderer.autoClear = false // 需要将自动清除关闭

animate()

function animate() {

    controls.update()

    // renderer.clear() // 可能需要的清除操作

    renderer.render(scene, camera)

    viewHelper.render(renderer)

    requestAnimationFrame(animate)

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=viewHelper) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
