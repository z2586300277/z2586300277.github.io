---
title: "球体文字 - Three.js 案例讲解"
description: "球体文字：Scene / Camera / Renderer 渲染管线、相机交互控制器（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,textSphere"
outline: deep
---

# 球体文字

*Text Sphere*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=textSphere)

![球体文字](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/textSphere.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 搭建灯光与环境（如有）
4. requestAnimationFrame 循环 update + render

## 代码要点

```js
const DOM = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)
camera.position.set(1, 2, 3)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
DOM.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)
camera.position.set(1, 2, 3)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
DOM.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)

// ...
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/textSphere.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=textSphere) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[数学公式应用](/examples/three/application/mathApply)
- 下一篇：[矩阵操作](/examples/three/application/matrixOperation)

> 应用场景 · Three.js · 26/68
