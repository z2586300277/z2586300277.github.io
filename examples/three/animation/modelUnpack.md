---
title: "模型拆解动画 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `animate`、`mergeHandle`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,模型拆解动画,动画效果"
outline: deep
---

# 模型拆解动画

*Model Unpack*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=modelUnpack)


![模型拆解动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/modelUnpack.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `animate`、`mergeHandle`。

> 动画效果 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 1))

const pointLight = new THREE.PointLight(0xffffff, 1.5, 0, 2)

pointLight.position.set(5, 5, 5)

scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)

directionalLight.position.set(-5, 5, -5)

scene.add(directionalLight)

```

