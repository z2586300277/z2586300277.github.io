---
title: "风力涡轮机尾迹 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `updateRotorPivotFromNacelle`、`updateWakeScaleFromRotor`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,风力涡轮机尾迹,应用场景"
outline: deep
---

# 风力涡轮机尾迹

*Wind Turbine Wake*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windTurbineWake)


![风力涡轮机尾迹](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/windTurbineWake.png)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `updateRotorPivotFromNacelle`、`updateWakeScaleFromRotor`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 反射/水面常用 Reflector 或自定义 renderTarget 贴图。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { Water } from 'three/addons/objects/Water.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a1020)
scene.fog = new THREE.Fog(0x0a1020, 80, 1000)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1600)
camera.position.set(48, 125, 210)
camera.lookAt(0, 100, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const stats = new Stats()
stats.showPanel(0)
stats.dom.style.position = 'absolute'
stats.dom.style.top = '20px'
stats.dom.style.right = '20px'
stats.dom.style.left = 'auto'
stats.dom.style.zIndex = '30'
document.body.appendChild(stats.dom)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.target.set(0, 100, 0)
controls.maxPolarAngle = Math.PI / 2.2
controls.enableZoom = true
controls.maxDistance = 900

scene.add(new THREE.AmbientLight(0x40406b))

const dirLight = new TH
```

