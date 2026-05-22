---
title: "着色器光效 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createGlowTexture`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,着色器光效,着色器"
outline: deep
---

# 着色器光效

*Shader Light*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=shaderLight)


![着色器光效](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/shaderLight.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`createGlowTexture`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `createFakeLight()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
```

### 片元

- 片元输出 gl_FragColor
- `time` uniform 驱动动画

```glsl
uniform sampler2D uTexture;
                    uniform float uOpacity;
                    uniform float uTime;
                    varying vec2 vUv;

                    void main() {
                        vec4 texColor = texture2D(uTexture, vUv);
                        float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
                        gl_FragColor = vec4(texColor.rgb, texColor.a * uOpacity * pulse);
                    }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let scene, camera, renderer, controls
let fakeLights = []
const clock = new THREE.Clock()

init()
animate()

function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0a1a')

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.set(0, 15, 30)

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    createFakeLights()
}

function createGlowTexture(color) {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.3, color.replace('1)', '0.6)'))
    gradient.addColorStop(0.6, color.replace('1)', '0.2)'))
    gradient.addColorStop(1, color.replace('1)', '0)'))

    ctx.fillStyle = gradient
    ctx
```

