---
title: "文字采集成粒子 - Three.js 案例讲解"
description: "Three.js 大量点/面片模拟粒子。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,文字采集成粒子,粒子"
outline: deep
---

# 文字采集成粒子

*Text Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=textParticle)


![文字采集成粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/textParticle.jpg)


## 效果说明

Three.js 大量点/面片模拟粒子。主流程在 `animate`。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const loader = new FontLoader()
loader.load(FILE_HOST + 'files/json/font.json', font => {

    const textGeometry = new TextGeometry(`
        Three.js
        Cesium.js
        Examples
          - star -
    `, {
        font,
        size: 1,
        depth: 0.5,
        curveSegments: 10,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5
    }).center()

    const mesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const sam
```

