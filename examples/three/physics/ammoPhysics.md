---
title: "物理ammo使用 - Three.js 案例讲解"
description: "物理ammo使用：Scene / Camera / Renderer 渲染管线、相机交互控制器、物理引擎集成（物理应用）"
head:
  - - meta
    - name: keywords
      content: "three.js,physics,ammoPhysics"
outline: deep
---

# 物理ammo使用

*Ammo Physics*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=physics&id=ammoPhysics)

![物理ammo使用](https://z2586300277.github.io/three-cesium-examples/threeExamples/physics/ammoPhysics.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 物理引擎集成

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 物理世界步进与 mesh 位置同步。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 初始化 physics world 并在 tick 中 step

## 代码要点

```js
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 1, 10000)

camera.position.set(15, 15, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true })



const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 1, 10000)

camera.position.set(15, 15, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(box.clientWidth, box.clientHeight)



const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/physics/ammoPhysics.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=physics&id=ammoPhysics) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[物理cannon使用](/examples/three/physics/physicsMesh)


> 物理应用 · Three.js · 2/2
