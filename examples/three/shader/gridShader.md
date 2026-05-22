---
title: "网格着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,网格着色器"
outline: deep
---
# 网格着色器

*Grid Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=gridShader)

![网格着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/gridShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

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

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100))

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const resolution = new THREE.Vector2(box.clientWidth, box.clientHeight)
const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00ff23') },
    uRepititions: { value: 5, min: 1, max: 10, step: 1 },
    uResolution: {
        max: resolution,
        value: resolution
    }
}

// refer https://shad3rs.vercel.app/shaders/grid
const vert = /* glsl */`
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    // Varyings
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;
}`

const frag = /* glsl */`
uniform vec2 uResolution;
uniform int uRepititions;
uniform vec3 uColor;
uniform float uTime;

varying vec3 vPosition;

#define DEBUG 0

const float PI = 3.14159265;
float sRGBencode(float C_linear) {
    return C_linear > 0.0031308 ? (1.055 * pow(C_linear, 1. / 2.4) - 0.055) : (12.92 * C_linear);
}
vec3 sRGBencode(vec3 C_linear) {
    C_linear = clamp(C_linear, 0., 1.);
    return vec3(sRGBencode(C_linear.x), sRGBencode(C_linear.y), sRGBencode(C_linear.z));
}

float hash(vec3 uv) {
    uint x = floatBitsToUint(uv.x) | 1u; // 0 is a fixed point so we remove it. although this introduces duplicate 1
    uint y = floatBitsToUint(uv.y);
    uint z = floatBitsToUint(uv.z);

    y ^= y >> 13;
    y ^= y << 17;
    y ^= y >> 5;
    y *= 0x2545F491u;

    x ^= y;
    x ^= x >> 13;
    x ^= x << 17;
    x ^= x >> 5;
    x *= 0x4F6CDD1Du;

    z ^= x;
    z ^= z >> 13;
    z ^= z << 17;
    z ^= z >> 5;
    z *= 0x1D6C45F4u;

    // Shift down by 9 to use top 23 bits in mantissa
    // Use exponent and sign bits from 0.5
    // floatBitsToUint(.5) is a constant so that part can be pre-computed. (0x3f000000)
    // Since the top 23 bits are shifted right, the rest (top bits) are zero and do not need to be masked out
    // uint w = ((z>>9) & 0x007FFFFFu) | (0xFF800000u & floatBitsToUint(.5));

    uint w = (z >> 9) | 0x3f000000u; // simplified version of the above commented out line

    // re-normalize from [0.5, 1) to [0, 1)
    // This probably loses some bits, but should still be ok
    return 2. * uintBitsToFloat(w) - 1.;
}

vec3 drops(vec2 uv) {
    vec3 color = vec3(0);
    float hash_cnt = 0.;
    // GRID
    float grid_size = 40.;
    // vec2 g = cos(grid_size * (uv * 2.0) * PI);
    vec2 g = cos(grid_size * (1.0 + uv) * PI);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=gridShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
