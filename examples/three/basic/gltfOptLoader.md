---
title: "Opt解压(su7 模型) - Three.js 案例讲解"
description: "Three.js Scene/Camera/Renderer 基础搭建。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,Opt解压(su7 模型),基础案例"
outline: deep
---

# Opt解压(su7 模型)

*GLTF Opt*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=gltfOptLoader)


![Opt解压(su7 模型)](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/gltfOptLoader.jpg)


## 效果说明

Three.js Scene/Camera/Renderer 基础搭建。主流程在 `animate`。

> 基础案例 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

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
```

