---
title: "贴图网格地面 - Three.js 案例讲解"
description: "贴图网格地面：Scene / Camera / Renderer 渲染管线、相机交互控制器（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,gridFloor"
outline: deep
---

# 贴图网格地面

*Grid Floor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=gridFloor)

![贴图网格地面](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/gridFloor.jpg)

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
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })



const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)



const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/gridFloor.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=gridFloor) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[光柱](/examples/three/application/lightBar)
- 下一篇：[花瓣雨](/examples/three/application/flowerRain)

> 应用场景 · Three.js · 30/68
