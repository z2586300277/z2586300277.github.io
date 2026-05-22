---
title: "粒子混合着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `getPosition`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,粒子混合着色器,粒子"
outline: deep
---

# 粒子混合着色器

*BlendShader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleBlendShader)


![粒子混合着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleBlendShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `getPosition`、`animate`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float size;

        uniform bool isdecaySize;

        void main() {

            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

            gl_PointSize = isdecaySize ? size * ( 300.0 / -mvPosition.z ) : size;

            gl_Position = projectionMatrix * mvPosition;

        }
```

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


```

