---
title: "表情 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `generateSilly`、`drawMouth`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,表情,应用场景"
outline: deep
---

# 表情

*Face Mesh*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=faceMesh)


![表情](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/faceMesh.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `generateSilly`、`drawMouth`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000)

camera.position.set(0, 0, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(innerWidth, innerHeight)

document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const atlasSize = new THREE.Vector2(2, 2)

renderer.setAnimationLoop(() => {

    controls.update()

    renderer.render(scene, camera)

})

const urls = [0, 1, 2, 3, 4, 5].map(k => ('https://z2586300277.github.io/three-editor/dist/files/scene/skyBox8/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls)

scene.background = textureCube

const atlas = ((dim) => {
    const c = document.createElement("canvas");
    const tileSize = 256;
    c.width = tileSize * dim.x;
    c.height = tileSize * dim.y;
    const u = (val) => tileSize * 0.01 * val;
    const ctx = c.getContext("2d");

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, c.width, c.height);

    for (let y = 0; y < dim.y; y++) {
        for (let x = 0; x < dim.x; x++) {
            generateSilly(x, y);
        }
    }

    con
```

