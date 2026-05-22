---
title: "Theatrejs - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `animate`、`createBtn`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,Theatrejs,动画效果"
outline: deep
---

# Theatrejs

*Theatre.js*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=Theatrejs)


![Theatrejs](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/theatrejs.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `animate`、`createBtn`。

> 动画效果 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- ===================== 创建动画物体 =====================
- ===================== Theatre.js 初始化 =====================
- Studio 面板根容器
- 面板透明度

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import theatrecore from '@theatre/core'
import theatrestudio from '@theatre/studio'

const core = theatrecore.default || theatrecore
const studio = theatrestudio.default || theatrestudio
const { getProject, types } = core

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(30, 25, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.shadowMap.enabled = true

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

directionalLight.position.set(20, 40, 20)

directionalLight.castShadow = true

scene.add(ambientLight, directionalLight)

// 地面
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0x333333 })
)

ground.rotation.x = -Math.PI / 2

ground.receiveShadow = true

scene.add(ground, new THREE.GridHelper(80, 16, 0x555555, 0x444444))
```

### ===================== 创建动画物体 =====================

```js
// 1. 立方体
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(4, 4, 4),
    new THREE.MeshStandardMaterial({ color: 0x049ef4 })
)

cube.position.set(-12, 2, 0)

cube.castShadow = true

scene.add(cube)

// 2. 球体
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xe91e63 })
)

sphere.position.set(0, 2.5, 0)

sphere.castShadow = true

scene.add(sphere)

// 3. 圆环
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.8, 16, 50),
    new THREE.MeshStandardMaterial({ color: 0x4caf50 })
)

torus.position.set(12, 3, 0)

torus.castShadow = true

scene.add(torus)
```

### ===================== Theatre.js 初始化 =====================

```js
// 初始化 Studio UI（编辑器面板）
studio.initialize()

// 自定义 Studio 面板样式 —— 通过 CSS 覆盖 #theatrejs-studio-root
const studioStyle = document.createElement('style')
studioStyle.textContent = `
```

