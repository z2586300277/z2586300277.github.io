---
title: "几何合并 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`、`mergeModelGeometries`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,几何合并,应用场景"
outline: deep
---

# 几何合并

*Geometry Merge*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=geometryMerge)


![几何合并](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/geometryMerge.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`、`mergeModelGeometries`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render
- `mergeModelGeometries()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// 基础场景设置
const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)
camera.position.set(5, 5, 5)

// 渲染器设置
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio * 2)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
box.appendChild(renderer.domElement)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 光源
scene.add(new THREE.AmbientLight(0xffffff, 3))

// 响应式调整
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

// 动画循环
function animate() {
    renderer.render(scene, camera)
    controls.update()
    requestAnimationFrame(animate)
}
animate
```

