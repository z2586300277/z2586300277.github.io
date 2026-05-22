---
title: "模型热力图 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`setHeat`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,模型热力图,扩展功能"
outline: deep
---

# 模型热力图

*Heatmap Model*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=heatmapModel)


![模型热力图](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/heatmapModel.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`setHeat`。

> 扩展功能 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)

camera.position.set(200, 200, 200)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.setPixelRatio(window.devicePixelRatio * 2)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// 渲染
animate()

function animate() {

    renderer.render(scene, camera)

    controls.update()

    requestAnimationFrame(animate)

}

class InterpolatedGradientMaterial extends THREE.ShaderMaterial {
    constructor({
        dataPoints = [],
        dataValues = [],
        colorLow = new THREE.Color(0x0000FF),
        colorHigh = new THREE.Color(0xFF0000),
     
```

### glsl

```js
`
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `

        const fragmentShader =
```

### glsl

```js
`
            varying vec3 vPosition;
            uniform vec3 dataPoints[DATA_POINTS_LENGTH];
            uniform float dataValues[DATA_POINTS_LENGTH];
            uniform vec3 colorLow;
            uniform vec3 colorHigh;
            uniform float minValue;
            uniform float maxValue;
            uniform int weightFunctionType;
            uniform vec2 smoothstepEdges;
            uniform float opacity;

            vec3 rgb2hsv(vec3 c) {
                vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
                vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
                vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
                float d = q.x - min(q.w, q.y);
                float e = 1.0e-10;
                return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
            }

            vec3 hsv2rgb(vec3 c) {
                vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            float getWeight(float distance) {
                if (weightFunctionType == 0) { // inverse
                    return 1.0 / distance;
                } else if (weightFunctionType == 1) { // inverse square
                    return 1.
```

