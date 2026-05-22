---
title: "辉光-postprocessing - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,辉光通道"
outline: deep
---

# 辉光-postprocessing

*Select Bloom*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=selectBloomPass)


![辉光-postprocessing](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/selectBloomPass.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `animate`。

> 后期处理 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BlendFunction, SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// 附加后处理库
const composer = new EffectComposer(renderer);

const bloomEffect = new SelectiveBloomEffect(scene, camera, {

    blendFunction: BlendFunction.ADD,

    mipmapBlur: true,

    luminanceThreshold: 0.4,

    luminanceSmoothing: 0.2,

    intensity: 3.0

})

composer.addPass(new RenderPass(scene, camera))

composer.addPass(new EffectPass(camera, bloomEffect))

// 添加10个立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xa0dee2 })

const boxMaterial2 = ne
```

