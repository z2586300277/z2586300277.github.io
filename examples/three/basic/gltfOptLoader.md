---
title: "Opt解压(su7 模型) - Three.js 案例讲解"
description: "本案例展示 **Opt解压(su7 模型)** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、requestAnimationFrame 渲染循环。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,Opt解压(su7 模型)"
outline: deep
---
# Opt解压(su7 模型)

*GLTF Opt*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=gltfOptLoader)

![Opt解压(su7 模型)](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/gltfOptLoader.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **Opt解压(su7 模型)** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、requestAnimationFrame 渲染循环。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 2, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

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

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// HDR
const pmremGenerator = new THREE.PMREMGenerator(renderer);

const texture = new RGBELoader().load(FILE_HOST + '/files/hdr/1k.hdr', (t) => {

    const map = pmremGenerator.fromEquirectangular(t).texture

    pmremGenerator.dispose()

    return map

})

texture.mapping = THREE.EquirectangularReflectionMapping

// GLTF
const loader = new GLTFLoader()

loader.setMeshoptDecoder(MeshoptDecoder)

loader.load(FILE_HOST + 'models/su7/sm_car.gltf', gltf => {

    scene.add(gltf.scene)

    gltf.scene.traverse(obj => {

        if (obj.isMesh) {

            obj.material.envMap = texture

        }

    })

})
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=gltfOptLoader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
