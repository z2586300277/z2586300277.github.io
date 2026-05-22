---
title: "物理ammo使用 - Three.js 案例讲解"
description: "Three.js 物理引擎联动。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,物理ammo使用,物理应用"
outline: deep
---

# 物理ammo使用

*Ammo Physics*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=physics&id=ammoPhysics)


![物理ammo使用](https://z2586300277.github.io/three-cesium-examples/threeExamples/physics/ammoPhysics.jpg)


## 效果说明

Three.js 物理引擎联动。主流程在 `animate`。

> 物理应用 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 1, 10000)

camera.position.set(15, 15, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.DirectionalLight(0xffffff, 3))

// 安装
const physics = await AmmoPhysics()

const floor = new THREE.Mesh(new THREE.BoxGeometry(60, 5, 60), new THREE.MeshLambertMaterial({ color: 0x444444 }))

floor.position.y -= 20

floor.userData.physics = { mass: 0 }

scene.add(floor)

for (let i = 0; i < 100; i++) {

    const geometry = Math.random() > 0.5 ? new THREE.IcosahedronGeometry() : new THREE.SphereGeometry()

    const material = new THREE.MeshLambertMaterial({ color: 0xffffff * Math.random() })

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5)

    mesh.userData.physics = { mass: 1 }

    scene.add(mesh)

}

physics.addScene(scene) // 启动物理引擎

animate()

functi
```

