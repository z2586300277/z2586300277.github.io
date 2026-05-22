---
title: "粒子混合着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子混合着色器"
outline: deep
---
# 粒子混合着色器

*BlendShader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleBlendShader)

![粒子混合着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleBlendShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`getPosition()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

// 粒子参数
const parameters = {

    particlesSum: 100000,

    inner: 0,

    outer: 1500,

    maxVelocity: 30,

    mapUrl: 'https://z2586300277.github.io/three-editor/dist/files/channels/snow.png',

    sportType: '全随机',

}

// 几何参数
const positions = new Float32Array(parameters.particlesSum * 3);

const velocities = new Float32Array(parameters.particlesSum * 3);

const setVelocities = {

    '全随机': (i) => {

        velocities[i * 3] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

        velocities[i * 3 + 1] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

        velocities[i * 3 + 2] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

    },

    '随机向上': (i) => {

        velocities[i * 3] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

        velocities[i * 3 + 1] += Math.abs((Math.random() - 0.5) * parameters.maxVelocity / 100000)

        velocities[i * 3 + 2] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

    },

    '随机向下': (i) => {

        velocities[i * 3] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

        velocities[i * 3 + 1] -= Math.abs((Math.random() - 0.5) * parameters.maxVelocity / 100000)

        velocities[i * 3 + 2] += (Math.random() - 0.5) * parameters.maxVelocity / 1000

    },

    '直线匀速向上': (i) => {

        velocities[i * 3] = 0

        velocities[i * 3 + 1] += parameters.maxVelocity / 2 / 100000

        velocities[i * 3 + 2] = 0

    },

    '直线匀速向下': (i) => {

        velocities[i * 3] = 0

        velocities[i * 3 + 1] -= parameters.maxVelocity / 2 / 100000

        velocities[i * 3 + 2] = 0

    }

}[parameters.sportType]

function getPosition() {

    let x, y, z

    do {

        x = Math.random() * 2 * parameters.outer - parameters.outer;

        y = Math.random() * 2 * parameters.outer - parameters.outer;

        z = Math.random() * 2 * parameters.outer - parameters.outer;

    } while (Math.abs(x) <= parameters.inner && Math.abs(y) <= parameters.inner && Math.abs(z) <= parameters.inner);

    return [x, y, z]

}

for (let i = 0; i < parameters.particlesSum; i++)  positions.set(getPosition(), i * 3)

const geometry = new THREE.BufferGeometry()

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleBlendShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
