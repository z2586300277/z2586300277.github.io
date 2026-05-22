---
title: "多轮廓光 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,多轮廓光"
outline: deep
---
# 多轮廓光

*Mult Outline Pass*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=multOutlinePass)

![多轮廓光](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/multOutlinePass.jpg)

## 你将学到什么

- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

原场景 + 后期 Pass 叠加。

> 基础案例 · Three.js

## 核心概念

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. EffectComposer 组装 Pass 链并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

// 后期处理
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

// 轮廓
const outlinePass = new OutlinePass(new THREE.Vector2(box.clientWidth, box.clientHeight), scene, camera);

outlinePass.visibleEdgeColor.set('red'); // 设置可见边缘颜色

composer.addPass(outlinePass);

const outputPass2 = new OutlinePass(new THREE.Vector2(box.clientWidth, box.clientHeight), scene, camera);

composer.addPass(outputPass2);

const outlinePass3 = new OutlinePass(new THREE.Vector2(box.clientWidth, box.clientHeight), scene, camera);

outlinePass3.visibleEdgeColor.set('blue');

composer.addPass(outlinePass3);

// 色彩校正
const outputPass = new OutputPass();

composer.addPass(outputPass);

const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), new THREE.MeshBasicMaterial())

cone.position.set(2, 0, 0)

scene.add(cone);

outlinePass.selectedObjects = [cone]

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))

scene.add(cube);

outputPass2.selectedObjects = [cube];

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 'yellow' }))

sphere.position.set(-2, 0, 0)

scene.add(sphere);

outlinePass3.selectedObjects = [sphere];

// 渲染
animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    composer.render()

}

// 适配
window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=multOutlinePass) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
