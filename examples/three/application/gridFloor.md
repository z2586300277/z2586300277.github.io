---
title: "贴图网格地面 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,贴图网格地面,应用场景"
outline: deep
---

# 贴图网格地面

*Grid Floor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=gridFloor)


![贴图网格地面](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/gridFloor.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100))

const map = new THREE.TextureLoader().load(HOST + 'files/images/grid.png')

const material = new THREE.MeshStandardMaterial({
    map,
    side: THREE.DoubleSide,
    transparent: true,
    emissive: 0x309df1, // 自发光颜色
    emissiveIntensity: 1, // 自发光强度
})

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    material
)

floor.rotation.x = -Math.PI / 2

scene.add(floor)

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

