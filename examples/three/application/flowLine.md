---
title: "贴图飞线 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,贴图飞线,应用场景"
outline: deep
---

# 贴图飞线

*Flow Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flowLine)


![贴图飞线](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/flowLine.jpg)


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

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(7, 7, 7)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const gridHelper = new THREE.GridHelper(10, 10)

scene.add(gridHelper)

// 生成一个管道
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(0, 2.5, 0),
    new THREE.Vector3(5, 0, 0)
])

const map = new THREE.TextureLoader().load(FILE_HOST + '/images/texture/flyLine1.png')

map.wrapS = THREE.RepeatWrapping

map.repeat.set(5, 2)

const tube = new THREE.TubeGeometry(curve, 200, 0.2, 2, false);

const material = new THREE.MeshBasicMaterial({ map, transparent: true })

const mesh = new THREE.Mesh(tube, material)

scene.add(mesh)

// 生成一个飞线
const curve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 0, 3),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(3, 0, -4),
    
])

const map
```

