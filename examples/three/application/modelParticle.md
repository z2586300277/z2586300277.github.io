---
title: "模型粒子化 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`createPoints`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,模型粒子化,应用场景"
outline: deep
---

# 模型粒子化

*Model Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=modelParticle)


![模型粒子化](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/modelParticle.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`createPoints`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

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
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(300, 300, 300)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    FILE_HOST + '/files/model/LittlestTokyo.glb',

    gltf => {

        let count = 0

        gltf.scene.traverse(child => {

            if (child.isMesh) {

                count++

                setTimeout(() => {

                    const particles = createPoints(child)

                    scene.add(particles)

                    gsap.to(particles.material, { opacity: 0.9, duration: 1 })

                }, count * 100)

            }

        })

    }

)

ani
```

