---
title: "辉光-postprocessing - Three.js 案例讲解"
description: "辉光-postprocessing：Scene / Camera / Renderer 渲染管线、相机交互控制器、EffectComposer 后处理管线（后期处理）"
head:
  - - meta
    - name: keywords
      content: "three.js,effectComposer,selectBloomPass"
outline: deep
---

# 辉光-postprocessing

*Select Bloom*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=selectBloomPass)

![辉光-postprocessing](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/selectBloomPass.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- EffectComposer 后处理管线

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. composer.addPass 串联后处理

## 代码要点

```js
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })



const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(box.clientWidth, box.clientHeight)



const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/effectComposer/selectBloomPass.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=selectBloomPass) 运行，再对照源码修改 uniform / 参数加深理解


- 下一篇：[自定义遮罩通道](/examples/three/effectComposer/customMaskPass)

> 后期处理 · Three.js · 1/10
