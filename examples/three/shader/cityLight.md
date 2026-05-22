---
title: "城市光影 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `modifyMaterial`、`addColor`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,城市光影,着色器"
outline: deep
---

# 城市光影

*City Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLight)


![城市光影](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityLight.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `modifyMaterial`、`addColor`。

> 着色器 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `modifyMaterial()` — 材质 / GLSL
- `addColor()` — 材质 / GLSL
- `addWave()` — 材质 / GLSL
- `addLightLine()` — 材质 / GLSL
- `addToTopLine()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import gsap from 'gsap'

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1000)
camera.position.set(5, 5, 5)
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio * 1.5)
document.body.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
renderer.setAnimationLoop(() =>  renderer.render(scene, camera))

//加载gltf
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(FILE_HOST + 'js/three/draco/')
dracoLoader.preload()
const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
loader.load(FILE_HOST + 'models/glb/build.glb', (gltf) => {
    const model = gltf.scene
    model.scale.set(0.01, 0.01, 0.01)
    scene.add(model)
    model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.material.dispose()
```

