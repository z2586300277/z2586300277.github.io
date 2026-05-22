---
title: "物理cannon使用 - Three.js 案例讲解"
description: "Three.js 物理引擎联动。主流程在 `animate`、`createPhysicsBody`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,物理cannon使用,物理应用"
outline: deep
---

# 物理cannon使用

*Physics Mesh*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=physics&id=physicsMesh)


![物理cannon使用](https://z2586300277.github.io/three-cesium-examples/threeExamples/physics/physicsMesh.jpg)


## 效果说明

Three.js 物理引擎联动。主流程在 `animate`、`createPhysicsBody`。

> 物理应用 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 物理：Cannon.js 刚体/碰撞体与 Three mesh 位置同步。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(5000), new THREE.AmbientLight(0xffffff, 0.5))

const pointLight = new THREE.PointLight(0xffffff, 3, 0)

pointLight.position.set(0, 2, 0)

scene.add(pointLight)

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) })

// 渲染时间略有不同的时间显示物理模拟的状态
world.PhysicsRender = (deltaTime) => {

    world.step(1 / 60, deltaTime, 3)

    world.bodies.forEach(body => body.render?.())

}

// 创建一个立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

cubeMesh.position.set(0, 5, 0)

createPhysicsBody(world, cubeMesh, 1)

scene.add(cubeMesh)

// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(10, 10)

const planeMaterial = new THREE.M
```

