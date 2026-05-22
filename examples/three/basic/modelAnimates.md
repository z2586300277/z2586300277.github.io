---
title: "单/多模型动画 - Three.js 案例讲解"
description: "本案例展示 **单/多模型动画** 的实现。涉及：AnimationMixer 骨骼动画播放与过渡、glTF/FBX/OBJ 外部模型加载、相机交互控制器。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,单/多模型动画"
outline: deep
---
# 单/多模型动画

*Model Animates*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelAnimates)

![单/多模型动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/modelAnimates.jpg)

## 你将学到什么

- AnimationMixer 骨骼动画播放与过渡
- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

本案例展示 **单/多模型动画** 的实现。涉及：AnimationMixer 骨骼动画播放与过渡、glTF/FBX/OBJ 外部模型加载、相机交互控制器。

> 基础案例 · Three.js

## 核心概念

- **AnimationMixer** 驱动 glTF 骨骼动画；每帧 `mixer.update(delta)`。动作切换可用 `crossFadeTo` 平滑过渡。

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`modelAnimationPlay()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'dat.gui'

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

const mixerFrames = []

animate()

function animate() {

    requestAnimationFrame(animate)

    mixerFrames.forEach(i => i?.mixerAnimateRender?.())

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 4))

scene.add(new THREE.AxesHelper(1000))

// 加载模型 gltf/ glb  draco解码器
const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    FILE_HOST + 'files/model/Soldier.glb',

    gltf => {

        const group = gltf.scene

        group.animations = gltf.animations

        scene.add(group)

        group.actionIndexs = new Array(group.animations.length).fill(false)

        createModeAnimates(group)

    }

)

const GUI = new dat.GUI()

// 模型加载完成
const createModeAnimates = model => {

    model.animations.forEach((_, k) => {

        GUI.add({

            fn: () => {

                model.actionIndexs.forEach((_, _k, arr) => arr[_k] = _k === k)

                modelAnimationPlay(model, model.animations)

            }

        }, 'fn').name(`单动画${k}`)

    });

    // 多动画
    GUI.add({

        fn: () => {

            const _actions = [1, 2] // 同时播放 第三个和第四个动画

            model.actionIndexs.forEach((_, k, arr) => arr[k] = _actions.includes(k))

            const { actions } = modelAnimationPlay(model, model.animations)

            setTimeout(() => actions.forEach((v => v.stop())), 4000)

        }
        
    }, 'fn').name('1, 2动画同时播放')

}

function modelAnimationPlay(group) {

    const clock = new THREE.Clock()

    const mixer = new THREE.AnimationMixer(group)
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=modelAnimates) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
