---
title: "卷曲动画 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `buildStripGeometry`、`updateStrip`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,卷曲动画,动画效果"
outline: deep
---

# 卷曲动画

*Curl Animate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=curlAnimate)


![卷曲动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/curlAnimate.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `buildStripGeometry`、`updateStrip`。

> 动画效果 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `updateStrip()` — 移除 Entity / 解绑监听
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 12, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)
// renderer.shadowMap.enabled = true
box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.8))
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
dirLight.position.set(5, 10, 5)
dirLight.castShadow = true
scene.add(dirLight)
scene.add(new THREE.DirectionalLight(0x4488ff, 0.5).position.set(-5, 5, -5))

// 钢带材质
const stripMat = new THREE.MeshStandardMaterial({
    color: 'white',
    metalness: 0.7,
    roughness: 0.15,
    side: THREE.DoubleSide,
    // envMapIntensity: 1.0
})

// 参数
const params = {
    speed: 1.0,
    stripWidth: 4,
    thickness: 0.15,
    coreRadius: 1.5,
    maxTurns: 8,
    feedLength: 12,
    playing: true,
    reset() { totalAngle = 0 }
}

let totalAngle = 0 // 已卷绕的总角度(弧度)
let stripMesh = null

// 构建钢带几何体：水平进料段 + 螺旋卷绕段
function bui
```

