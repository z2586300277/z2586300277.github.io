---
title: "Mesh变换动画 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `animate`、`setTransformAnimate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,变换动画"
outline: deep
---

# Mesh变换动画

*Transform Gsap*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=transformAnimate)


![Mesh变换动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/transformAnimate.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `animate`、`setTransformAnimate`。

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
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

animate()

function animate() {

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AxesHelper(100000), new THREE.AmbientLight(0xffffff, 6))

// 加载模型
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.0005, 0.0005, 0.0005)

    setTransformAnimate(object3d)

})

// 变换动画
function setTransformAnimate(mesh) {

    const position = mesh.position.clone()
    
    position.y += 5 // 位置向上移动100

    const rotation = mesh.rotation.clone()

    rotation.y += Ma
```

