---
title: "场景雾化 - Three.js 案例讲解"
description: "本案例展示 **场景雾化** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,场景雾化"
outline: deep
---
# 场景雾化

*Scene Fog*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=sceneFog)

![场景雾化](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/sceneFog.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **场景雾化** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`getFog()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`setFogFolder()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 20, 60)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 1))

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

directionalLight.position.set(0, 100, 0)

scene.add(directionalLight)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('files/model/Fox.glb'), (gltf) => {

    gltf.scene.position.set(0, 0, -500)

    scene.add(gltf.scene)

})

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('models/glb/foorGround.glb'), (gltf) => {

    const model = gltf.scene

    model.position.z += 60

    model.position.x -= 200

    model.scale.set(10, 10, 10)

    scene.add(model)

})

function getFog(type, color) {

    renderer.setClearColor(color || 0xffffff)

    if (type === 'linear') return new THREE.Fog(color || 0xffffff, 10, 800)

    else return new THREE.FogExp2(color || 0xffffff, 0.005)

}

const folder = new GUI()

let fogFolder = null

const fogOption = { type: scene.fog instanceof THREE.FogExp2 ? 'exp2' : 'linear', enable: !!scene.fog }

folder.add(fogOption, 'type', ['linear', 'exp2']).name('雾类型').onChange((v) => {

    scene.fog = getFog(v, scene.fog?.color)

    setFogFolder(v)

})

folder.add(fogOption, 'enable').name('启用雾').onChange((v) => {

    if (v) scene.fog = getFog(fogOption.type)

    else scene.fog = null

    setFogFolder(fogOption.type)

})

fogOption.enable && setFogFolder(fogOption.type)

function setFogFolder(type) {

    if (fogFolder) {

        fogFolder.destroy?.()

        fogFolder = null

    }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=sceneFog) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
