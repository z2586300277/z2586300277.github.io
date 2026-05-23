---
title: "Canvas贴图 - Three.js 案例讲解"
description: "Canvas贴图：Scene / Camera / Renderer 渲染管线、相机交互控制器、onBeforeCompile 修改内置材质 shader（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,canvasTexture,片元着色器,uniform 驱动,Canvas 纹理"
outline: deep
---

# Canvas贴图

*Canvas Texture*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=canvasTexture)

![Canvas贴图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/canvasTexture.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- onBeforeCompile 修改内置材质 shader

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：片元着色器、uniform 驱动、Canvas 纹理。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 替换 `#include <begin_vertex>` 等 chunk 注入特效，适合 PBR 材质叠加大屏效果。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. material.onBeforeCompile 注入 GLSL 与 uniform

## 代码要点

```js
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })



const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)



const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/canvasTexture.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=canvasTexture) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[鬼屋](/examples/three/application/ghostHouse)
- 下一篇：[贴图飞线](/examples/three/application/flowLine)

> 应用场景 · Three.js · 5/68
