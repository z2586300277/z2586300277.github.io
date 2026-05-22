---
title: "高斯sparkjs - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,高斯sparkjs,扩展功能"
outline: deep
---

# 高斯sparkjs

*sparkjs*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=sparkjs)


![高斯sparkjs](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/sparkjs.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `animate`。

> 扩展功能 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100))

const spark = new SparkRenderer({ renderer });

scene.add(spark);

const params = { url: FILE_HOST + 'other/deskFlower.ksplat' }

const butterfly = new SplatMesh(params);

butterfly.quaternion.set(0, 0, -1, 0);

butterfly.position.set(2, 2, -3)

scene.add(butterfly)

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
```

