---
title: "无限行驶 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。入口在 `InfiniteRoad`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,无限行驶,应用场景"
outline: deep
---

# 无限行驶

*Driving*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=driving)


![无限行驶](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/drivingCar.jpg)


## 效果说明

Three.js 业务向场景组合。入口在 `InfiniteRoad`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### InfiniteRoad

- `constructor()` — 初始化成员
- `createPlane()` — 材质 / GLSL
- `createRoadMarkings()` — 材质 / GLSL
- `createTrees()` — 材质 / GLSL
- `update()` — 每帧更新 geometry uniform 或实例矩阵
- `updateRoadElements()`

### Car

- `constructor()` — 初始化成员
- `createWheels()` — 材质 / GLSL
- `addLights()` — 材质 / GLSL
- `update()` — 每帧更新 geometry uniform 或实例矩阵

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 基础场景设置
const container = document.getElementById('box')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87CEEB)

// 相机和渲染器
const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000)
camera.position.set(0, 5, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.shadowMap.enabled = true
container.appendChild(renderer.domElement)

// 控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 光照
scene.add(new THREE.AmbientLight(0xffffff, 0.5))
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
dirLight.position.set(10, 10, 10)
dirLight.castShadow = true
dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 1024
scene.add(dirLight)

// 无限道路系统类
class InfiniteRoad {
  constructor() {
    this.speed = 0.2
    this.roadLength = 200
    
    // 创建共享纹理加载器
    const textureLoader = new THREE.TextureLoader()
    
    // 创建道路和草地
    this.road = this.createPlane(10, this.roadLength, 
      textureLoader.load('https://threejs.org/examples/textures/roads/road1.jpg'),
      { repeat: [1, 10], y: 0.01, color: 0x444444 })
    
    t
```

