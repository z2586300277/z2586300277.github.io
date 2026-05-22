---
title: "雷达扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,雷达扫描,着色器"
outline: deep
---

# 雷达扫描

*Radar Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=radarScan)


![雷达扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/radarScan.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

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

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000)

camera.position.set(0, 800, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 定义雷达参数
const radarData = {
  position: {
    x: 0,
    y: 20,
    z: 0
  },
  radius: 240,
  color: '#f005f0',
  opacity: 0.5,
  speed: 300,
  followWidth: 220
}

// 创建几何体
const circleGeometry = new THREE.CircleGeometry(radarData.radius, 1000)
const rotateMatrix = new THREE.Matrix4().makeRotationX((-Math.PI / 180) * 90)
circleGeometry.applyMatrix4(rotateMatrix)

// 创建材质
const material = new THREE.MeshBasicMaterial({
  co
```

