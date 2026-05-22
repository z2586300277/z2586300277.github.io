---
title: "拖拽控制 - Three.js 案例讲解"
description: "本案例展示 **拖拽控制** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、实时阴影 ShadowMap。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,拖拽控制"
outline: deep
---
# 拖拽控制

*Transform Obj*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=transformObject)

![拖拽控制](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/transformObject.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 实时阴影 ShadowMap
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **拖拽控制** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、实时阴影 ShadowMap。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 3, 6)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.shadowMap.needsUpdate = true

renderer.shadowMap.enabled = true

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const folder = new GUI()

// 变换控制器
const transformControls = new TransformControls(camera, renderer.domElement)

// 模式 'translate' | 'rotate' | 'scale'
folder.add(transformControls, 'mode', ['translate', 'rotate', 'scale']).name('模式')

const transformControlsRoot = transformControls.getHelper()

scene.add(transformControlsRoot)

transformControls.addEventListener('dragging-changed', event => {

    controls.enabled = !event.value

})

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('files/model/Fox.glb'), (gltf) => {

    const model = gltf.scene

    model.scale.set(0.01, 0.01, 0.01)

    model.traverse((child) => {

        if (child.isMesh) child.castShadow = true

    })

    scene.add(model)

    folder.add({ '控制模型': () => transformControls.attach(model) }, '控制模型')

})

const pointLight = new THREE.DirectionalLight(0xffffff, 1)

pointLight.position.set(1, 2, 0)

pointLight.castShadow = true

scene.add(pointLight)

folder.add({ '控制光源': () => transformControls.attach(pointLight) }, '控制光源')

const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xffffff }))

plane.position.y -= 0.5

plane.rotation.x = -Math.PI / 2

plane.receiveShadow = true

scene.add(plane)

folder.add({ '控制平面': () => transformControls.attach(plane) }, '控制平面')

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=transformObject) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
