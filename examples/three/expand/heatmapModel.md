---
title: "模型热力图 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,expand,模型热力图"
outline: deep
---
# 模型热力图

*Heatmap Model*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=heatmapModel)

![模型热力图](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/heatmapModel.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 扩展功能 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 代码要点

- **`setHeat()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
        minValue = 0,
        maxValue = 1,
        opacity = 1,
        weightFunction = 'inverse_square',
        smoothstepEdges = { min: 0.0, max: 1.0 }
    }) {
        // 如果数据为空，填充假数据
        if (dataPoints.length === 0 || dataValues.length === 0) {
            console.warn("dataPoints and dataValues are empty. Using default fake data.")
            const fakeDataLength = 10 // 假数据长度
            dataPoints = Array.from({ length: fakeDataLength }, (_, i) => new THREE.Vector3(i, 0, 0)) // 填充简单的假数据
            dataValues = Array.from({ length: fakeDataLength }, (_, i) => i) // 填充简单的假数据
        }

        const vertexShader = /* glsl */`
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `

        const fragmentShader = /* glsl */`
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
                    return 1.0 / (distance * distance);
                } else if (weightFunctionType == 2) { // exponential
                    return exp(-distance);
                }
                return 1.0 / (distance * distance); // default to inverse square
            }

            void main() {
                float totalWeight = 0.0;
                float weightedValue = 0.0;
                for(int i = 0; i < DATA_POINTS_LENGTH; i++) {
                    float distance = length(vPosition - dataPoints[i]);
                    float weight = getWeight(distance);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=heatmapModel) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/three/expand/)

> 扩展功能 · Three.js
