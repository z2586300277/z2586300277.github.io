---
title: "模型视图 - Three.js 案例讲解"
description: "本案例展示 **模型视图** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、GSAP / anime.js 属性动画。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,模型视图"
outline: deep
---
# 模型视图

*Model View*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelView)

![模型视图](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/modelView.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **模型视图** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、GSAP / anime.js 属性动画。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`getObjectViews()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createGsapAnimation()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

let model

const gui = new GUI()

new GLTFLoader().load(

    FILE_HOST + 'models/glb/computer.glb',

    gltf => {

        model = scene.add(gltf.scene)

        const { frontView, target, rightView, topView, bottomView, backView, maxView } = getObjectViews(model)

        const setView = view => {

            createGsapAnimation(controls.object.position, view)

            createGsapAnimation(controls.target, target)

        }

        gui.add({ '前视图': () => setView(frontView) }, '前视图')

        gui.add({ '右视图': () => setView(rightView) }, '右视图')

        gui.add({ '上视图': () => setView(topView) }, '上视图')

    }

)

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

function getObjectViews(object, fov = 50) {

    const box = new THREE.Box3().setFromObject(object)

    const { max, min } = box

    const center = new THREE.Vector3()

    box.getCenter(center)

    const radius = new THREE.Vector3().subVectors(max, min).length() / 2

    const dir = object.getWorldDirection(new THREE.Vector3()) // 物体方向

    const distance = radius / Math.tan(Math.PI * fov / 360) // 根据半径和相机视角 计算出距离

    const vector = dir.multiplyScalar(distance) // 方向距离向量

    const frontView = vector.clone().add(center)

    const leftView = vector.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2).add(center)

    const rightView = vector.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2).add(center)

    const topView = vector.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2).add(center)

    const bottomView = vector.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2).add(center)

    const backView = vector.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI).add(center)

    return { frontView, leftView, rightView, topView, bottomView, backView, target: center }

}

function createGsapAnimation(position, position_) {

    return gsap.to(

        position,

        {

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelView) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
