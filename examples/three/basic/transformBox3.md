---
title: "变换Box3 - Three.js 案例讲解"
description: "本案例展示 **变换Box3** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、实时阴影 ShadowMap。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,变换Box3"
outline: deep
---
# 变换Box3

*Transform Box3*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=transformBox3)

![变换Box3](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/transformBox3.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 实时阴影 ShadowMap
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

本案例展示 **变换Box3** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、实时阴影 ShadowMap。

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
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
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

folder.add(transformControls, 'mode', ['translate', 'rotate', 'scale']).name('模式')

const transformControlsRoot = transformControls.getHelper()

transformControls.addEventListener('dragging-changed', event => controls.enabled = !event.value)

const box3 = new THREE.Box3()

const box3Helper = new THREE.Box3Helper(box3, 0xffff00)

scene.add(box3Helper)

transformControls.addEventListener('change', () => box3Helper.box = box3.setFromObject(transformControls.object))

scene.add(transformControlsRoot)

// 模型
const texture = new RGBELoader().load(FILE_HOST + '/files/hdr/1k.hdr', t => t.mapping = THREE.EquirectangularReflectionMapping)

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('files/model/Fox.glb'), (gltf) => {

    const model = gltf.scene

    model.scale.set(0.01, 0.01, 0.01)

    model.traverse((child) => child.isMesh && (child.material.envMap = texture))

    scene.add(model)

    transformControls.attach(model)

})

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=transformBox3) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
