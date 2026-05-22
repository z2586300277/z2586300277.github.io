---
title: "网格着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,网格着色器,着色器"
outline: deep
---

# 网格着色器

*Grid Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=gridShader)


![网格着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/gridShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

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
const vert =
```

### glsl

```js
`
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

const frag =
```

### glsl

```js
`
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

    uint w = (z >> 9) | 0x3f000000u; // simplif
```

