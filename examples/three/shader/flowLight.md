---
title: "流光 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,流光"
outline: deep
---
# 流光

*Flow Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowLight)

![流光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/flowLight.jpg)

## 你将学到什么

- EffectComposer 后期处理管线
- 相机交互控制器
- 天空盒与环境贴图
- GSAP / anime.js 属性动画
- 轮廓高亮 OutlinePass

## 效果说明

原场景 + 后期 Pass 叠加。

> 着色器 · Three.js

## 核心概念

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. EffectComposer 组装 Pass 链并 render

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

const geometry = new TorusKnotGeometry( 10, 0.2, 800, 16 )

const material = new MeshBasicMaterial({ color: 0xffffff, map: lineTexture, side: DoubleSide })
const torus = new Mesh(geometry, material)
scene.add(torus)

gsap.to(lineTexture.offset, {
	x: 0.6,
	duration: 5,
	repeat: -1
})

const renderPass = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
const bloomPass = new UnrealBloomPass(new Vector2(size.width, size.height), 3, 0.8, 0.85)
const outputPass = new OutputPass()
composer.addPass(renderPass)
composer.addPass(bloomPass)
composer.addPass(outputPass)

const animate = () => {
	requestAnimationFrame(animate)
	controls.update()
	composer.render()
}

animate()
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowLight) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
