---
title: "流光 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,流光"
outline: deep
---

# 流光

*Flow Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowLight)


![流光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/flowLight.jpg)


## 效果说明

原场景 + 后期 Pass 叠加。主流程在 `animate`。

> 着色器 · Three.js

## 实现思路

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import {
	AmbientLight,
	Color,
	DirectionalLight,
	DoubleSide,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	TextureLoader,
	TorusKnotGeometry,
	Vector2,
	WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const size = { width: window.innerWidth, height: window.innerHeight }
const scene = new Scene()
scene.background = new Color('black')

const camera = new PerspectiveCamera(50, size.width / size.height, 1, 10000)
camera.position.set(0, 0, 50)

const renderer = new WebGLRenderer({ antialias: true, alpha: true , logarithmicDepthBuffer: true})
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const textureLoader = new TextureLoader()
const lineTexture = textureLoader.load(FILE_HOST + 'images/channels/flowLight.png')
lineTexture.offset.x = -0.6

const g
```

