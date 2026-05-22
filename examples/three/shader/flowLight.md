---
title: "流光 - Three.js 案例讲解"
description: "流光：相机交互控制器、EffectComposer 后处理管线、动画与时间线（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,flowLight"
outline: deep
---

# 流光

*Flow Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowLight)

![流光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/flowLight.jpg)

## 你将学到什么

- 相机交互控制器
- EffectComposer 后处理管线
- 动画与时间线

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。

## 实现步骤

1. 创建 OrbitControls 并处理 resize
2. composer.addPass 串联后处理
3. mixer.update(delta) 或 gsap.to 驱动属性

## 代码要点

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
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/flowLight.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowLight) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[栅格网格](/examples/three/shader/rasterGrid)
- 下一篇：[灰度](/examples/three/shader/grayShader)

> 着色器 · Three.js · 47/89
