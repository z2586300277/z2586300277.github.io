---
title: "多视图 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `animate`、`layout`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,多视图,扩展功能"
outline: deep
---

# 多视图

*Mult Views*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=multViews)


![多视图](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/multViews.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `animate`、`layout`。

> 扩展功能 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

// 视口尺寸计算（主视口占 65%，下方三个子视口各占 35%/3）
const layout = () => {
    const W = box.clientWidth, H = box.clientHeight
    const subH = Math.floor(H * 0.35)
    return { W, H, subH, mainH: H - subH, subW: Math.floor(W / 3) }
}

// composer 工厂
const makeComposer = (cam, w, h) => {
    const c = new EffectComposer(renderer)
    c.addPass(new RenderPass(scene, cam))
    c.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0, 0))
    c.setSize(w, h)
    return c
}

// 主相机（透视）
const { W: W0, mainH: mainH0, subH: subH0, subW: subW0 } = layout()
const camera = new THREE.PerspectiveCamera(75, W0 / mainH0, 0.1, 1000)
camera.position.set(400, 400, 400)
const 
```

