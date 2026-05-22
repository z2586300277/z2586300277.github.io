---
title: "流动围栏 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `createFenceGeometry`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,流动围栏,应用场景"
outline: deep
---

# 流动围栏

*Sport Fence*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=sportFence)


![流动围栏](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/sportFence.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `createFenceGeometry`、`animate`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

const points = [
    new THREE.Vector3(10, 0, 20),
    new THREE.Vector3(25, 0, 0),
    new THREE.Vector3(-30, 0, -20),
    new THREE.Vector3(-20, 0, 30),
];

const height = 20;
const fenceGeometry = createFenceGeometry(points, height);

const color = new THREE.Color(0xb9f9c3);

const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load(FILE_HOST + 'images/channels/wall_g.png')
});
const fence = new THREE.Mesh(fenceGeometry, material);
scene.add(fence);

const texture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/wall_line.png')
texture.wrapS = TH
```

