---
title: "动画合集 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `loop`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,动画合集,动画效果"
outline: deep
---

# 动画合集

*GSAP*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=gsapCollection)


![动画合集](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/gsapCollection.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `loop`、`animate`。

> 动画效果 · Three.js

## 实现思路

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import gsap from 'gsap'

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1E2630, 0.002)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
camera.animAngle = 0
camera.position.set(Math.cos(camera.animAngle) * 400, 180, Math.sin(camera.animAngle) * 400)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.setClearColor(scene.fog.color)

scene.add(new THREE.GridHelper(600, 10))

const alight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(alight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(1, 1, 1)
scene.add(light)

const light2 = new THREE.DirectionalLight(0x002288, 1)
light2.position.set(-1, -1, -1)
scene.add(light2)

const dome = new THREE.Mesh(new THREE.IcosahedronGeometry(700, 1), new THREE.MeshPhongMaterial({
    color: 0xfb3550,
    side: THREE.BackSide
}))
scene.add(dome)

const planeGeometry = new THREE.PlaneGeometry(600, 600)
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x222A38,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotat
```

