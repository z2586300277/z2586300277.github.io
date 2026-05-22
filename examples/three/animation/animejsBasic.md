---
title: "animejs使用 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `loop`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,animejs使用,动画效果"
outline: deep
---

# animejs使用

*Animejs Basic*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=animejsBasic)


![animejs使用](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/animejsBasic.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `loop`。

> 动画效果 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 制作animate
- 添加球体
- 添加环形
- 添加平面

## 独立函数

- `loop()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { animate } from 'animejs'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

loop()

function loop() {

    requestAnimationFrame(loop)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

### 制作animate

```js
const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
animate(cube.rotation, {
    x: Math.PI,
    y: Math.PI,
    z: Math.PI,
    duration: 2000,
    loop: true
})
```

### 添加球体

```js
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
const sphereMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x1E90FF, 
    shininess: 100,
    specular: 0xffffff
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(-20, 10, 0)
scene.add(sphere)

// 添加光源使球体材质效果更好
const light = new THREE.DirectionalLight(0xffffff, 1.0)
light.position.set(10, 20, 30)
scene.add(light)
scene.add(new THREE.AmbientLight(0x404040))

// 球体位置动画
animate(sphere.position, {
    y: [10, 20, 10],
    easing: 'easeInOutQuad',
    duration: 3000,
    loop: true
})
```

