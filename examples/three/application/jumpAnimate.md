---
title: "跳跃动画 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,跳跃动画"
outline: deep
---
# 跳跃动画

*Jump Animate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=jumpAnimate)

![跳跃动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/jumpAnimate.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`randomizeTargets()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 2000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.GridHelper(10, 10))

// uniforms
const uniforms = {
    points: {
        value: [
            new THREE.Vector3(-30, 2.0, 0),
            new THREE.Vector3(0, 5.0, 0),
            new THREE.Vector3(30, 10.0, 0)
        ]
    },
    // 目标点（用于插值过渡）
    targetPoints: {
        value: [
            new THREE.Vector3(-30, 2.0, 0),
            new THREE.Vector3(0, 5.0, 0),
            new THREE.Vector3(30, 10.0, 0)
        ]
    },
    baseInfluenceRadius: { value: 5.0 },
    heightToRadiusRatio: { value: 2.0 },
    falloffPower: { value: 2.0 },
    baseHeight: { value: 0.0 },
    maxHeight: { value: 10.0 },
    color1: { value: new THREE.Color(0x0066ff) },
    color2: { value: new THREE.Color(0xff3300) },
}

// 顶点着色器
const vertexShader = `
uniform vec3 points[3];
uniform float baseInfluenceRadius;
uniform float heightToRadiusRatio;
uniform float falloffPower;
uniform float baseHeight;
uniform float maxHeight;

varying float vHeightRatio;

float calculateInfluence(vec3 point, vec3 vertex) {
    float distance2D = length(point.xz - vertex.xz);
    float dynamicRadius = baseInfluenceRadius + point.y * heightToRadiusRatio;
    dynamicRadius = max(dynamicRadius, baseInfluenceRadius);
    if (distance2D > dynamicRadius) return 0.0;
    float normalizedDistance = distance2D / dynamicRadius;
    float attenuation = pow(1.0 - normalizedDistance, falloffPower);
    return attenuation * point.y;
}

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    float heightOffset = 0.0;
    heightOffset += calculateInfluence(points[0], worldPosition.xyz);
    heightOffset += calculateInfluence(points[1], worldPosition.xyz);
    heightOffset += calculateInfluence(points[2], worldPosition.xyz);
    vHeightRatio = clamp(heightOffset / maxHeight, 0.0, 1.0);
    vec3 newPosition = position;
    newPosition.y += heightOffset + baseHeight;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

// 片段着色器
const fragmentShader = `
uniform vec3 color1;
uniform vec3 color2;
varying float vHeightRatio;

void main() {
    vec3 color = mix(color1, color2, vHeightRatio);
    gl_FragColor = vec4(color, 1.0);
}
`

// 创建网格
const geometry = new THREE.BoxGeometry(200, 10, 1, 200, 1, 1).rotateX(-Math.PI / 2)
const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    wireframe: true
})
scene.add(new THREE.Mesh(geometry, material))

// GUI 参数
const params = {
    baseInfluenceRadius: 5.0,
    heightToRadiusRatio: 2.0,
    falloffPower: 2.0,
    baseHeight: 0.0,
    maxHeight: 10.0,
    autoUpdate: true,
    interval: 1.0,
    wireframe: true,
    color1: '#0066ff',
    color2: '#ff3300',
}

// GUI 控制
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=jumpAnimate) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
