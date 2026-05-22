---
title: "点击第三人称移动 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。点击地面，人物会自动走到目标位置。主流程在 `animate`、`goAddress`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,点击第三人称移动,动画效果"
outline: deep
---

# 点击第三人称移动

*Person Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=personAnimation)


![点击第三人称移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/personAnimation.jpg)


## 效果说明

Three.js 关键帧或补间动画。点击地面，人物会自动走到目标位置。主流程在 `animate`、`goAddress`。

> 动画效果 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 4), new THREE.GridHelper(40, 20))

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

let group = null

new GLTFLoader().load(FILE_HOST + 'files/model/Soldier.glb',

    gltf => {

        group = gltf.scene

        scene.add(group)

        const clock = new THREE.Clock() // 时钟

        const mixer = new THREE.AnimationMixer(group) // 模型动画

        group.mixerAnimateRender = () => mixer.update(clock.getDelta()) // 动画帧

        group.currentAction = mixer.clipAction(gltf.animations[3]) // walk 动画

    }

)

const raycaster = new THREE.Raycaster() // 射线

const targetPos
```

