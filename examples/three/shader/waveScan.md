---
title: "波扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,波扫描"
outline: deep
---
# 波扫描

*Wave Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waveScan)

![波扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/waveScan.jpg)

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

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 0.6)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const uniforms = {

    iTime: {

        value: 0

    },

    iResolution: {

        value: new THREE.Vector2(box.clientWidth, box.clientHeight)

    }

}

const geometry = new THREE.PlaneGeometry(1, 1)

const material = new THREE.ShaderMaterial({

    uniforms,

    transparent: true,

    side: THREE.DoubleSide,

    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() { 
          vUv = uv; 
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
      }
  `,
    fragmentShader: `
  uniform float iTime;
  const float PI = 3.14159265359;

  float random(float p){
      return fract(sin(p) * 10000.0);
  } 
  
  float noise(vec2 p){
      float t = iTime / 2000.0;
      if(t > 1.0) t -= floor(t);
      return random(p.x * 14. + p.y * sin(t) * 0.5);
  }

  vec2 sw(vec2 p){
      return vec2(floor(p.x), floor(p.y));
  }
  
  vec2 se(vec2 p){
      return vec2(ceil(p.x), floor(p.y));
  }
  
  vec2 nw(vec2 p){
      return vec2(floor(p.x), ceil(p.y));
  }
  
  vec2 ne(vec2 p){
      return vec2(ceil(p.x), ceil(p.y));
  }

  float smoothNoise(vec2 p){
      vec2 inter = smoothstep(0.0, 1.0, fract(p));
      float s = mix(noise(sw(p)), noise(se(p)), inter.x);
      float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
      return mix(s, n, inter.y);
  }

  mat2 rotate (in float theta){
      float c = cos(theta);
      float s = sin(theta);
      return mat2(c, -s, s, c);
  }

  float circ(vec2 p){
      float r = length(p);
      r = log(sqrt(r));
      return abs(mod(4.0 * r, PI * 2.0) - PI) * 3.0 + 0.2;
  }

  float fbm(in vec2 p){
      float z = 2.0;
      float rz = 0.0;
      vec2 bp = p;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waveScan) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
