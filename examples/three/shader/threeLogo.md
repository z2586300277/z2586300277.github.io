---
title: "three.js Logo - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,three.js Logo"
outline: deep
---
# three.js Logo

*Three Logo*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=threeLogo)

![three.js Logo](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/threeLogo.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createThreeJSLogoGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // 创建基于位置和时间的渐变效果
  float noise = sin(vPosition.x * 2.0 + time) * 0.25 +
               cos(vPosition.y * 2.0 + time * 0.5) * 0.25 +
               sin(vPosition.z * 2.0 + time * 0.8) * 0.5;
  
  // 边缘发光效果
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
  
  // 混合颜色
  vec3 baseColor = mix(color1, color2, noise + 0.5);
  vec3 glowColor = mix(baseColor, color3, fresnel);
  
  // 添加脉冲效果
  float pulse = (sin(time * 2.0) + 1.0) * 0.15 + 0.85;
  
  gl_FragColor = vec4(glowColor * pulse, 1.0);
}
`

const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xdbb8ff) },
        color2: { value: new THREE.Color(0x98d0fb) },
        color3: { value: new THREE.Color(0xfdebbf) }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true
})

const gui = new GUI()
gui.addColor(material.uniforms.color1, 'value').name('Color 1')
gui.addColor(material.uniforms.color2, 'value').name('Color 2')
gui.addColor(material.uniforms.color3, 'value').name('Color 3')

const geometry = createThreeJSLogoGeometry()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

function createThreeJSLogoGeometry() {
    // 基础变量设置
    const v = new THREE.Vector2(0, 1);
    const c = new THREE.Vector2();
    const s = 0.85; // 缩放比例

    // 创建基本三角形
    const tri = [
        v.clone().multiplyScalar(s).add(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, (-Math.PI * 2) / 3).multiplyScalar(s).add(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, (Math.PI * 2) / 3).multiplyScalar(s).add(new THREE.Vector2(0, -0.25))
    ];

    // 创建翻转三角形
    const triFlip = [
        v.clone().rotateAround(c, Math.PI).multiplyScalar(s).sub(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, Math.PI / 3).multiplyScalar(s).sub(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, -Math.PI / 3).multiplyScalar(s).sub(new THREE.Vector2(0, -0.25))
    ];

    // 创建三角形孔洞
    const holes = [];
    const hA = 3 / Math.sqrt(3) * 0.5;

    // 生成图案中的三角形孔洞
    for (let row = 0; row < 4; row++) {
        const items = 1 + row * 2;
        const h = 1.5 * (1.5 - row);
        const w = -((items - 1) / 2) * hA;

        for (let i = 0; i < items; i++) {
            const offsetX = w + hA * i;
            const offsetY = h;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=threeLogo) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
