---
title: "罗盘 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,罗盘"
outline: deep
---
# 罗盘

*Compass Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=compassShader)

![罗盘](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/compassShader.jpg)

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
  uniform float ratio;

  float PI = 3.1415926;
  uniform float iTime;
  uniform vec2 iResolution; 
  varying vec2 vUv;
  
  vec2 rotate(vec2 p, float rad) {
      mat2 m = mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
      return m * p;
  }
  
  vec2 translate(vec2 p, vec2 diff) {
      return p - diff;
  }
  
  vec2 scale(vec2 p, float r) {
      return p*r;
  }
  
  float circle(float pre, vec2 p, float r1, float r2, float power) {
      float leng = length(p);
      float d = min(abs(leng-r1), abs(leng-r2));
      if (r1<leng && leng<r2) pre /= exp(d)/r2;
      float res = power / d;
      return clamp(pre + res, 0.0, 1.0);
  }
  
  float rectangle(float pre, vec2 p, vec2 half1, vec2 half2, float power) {
      p = abs(p);
      if ((half1.x<p.x || half1.y<p.y) && (p.x<half2.x && p.y<half2.y)) {
          pre = max(0.01, pre);
      }
      float dx1 = (p.y < half1.y) ? abs(half1.x-p.x) : length(p-half1);
      float dx2 = (p.y < half2.y) ? abs(half2.x-p.x) : length(p-half2);
      float dy1 = (p.x < half1.x) ? abs(half1.y-p.y) : length(p-half1);
      float dy2 = (p.x < half2.x) ? abs(half2.y-p.y) : length(p-half2);
      float d = min(min(dx1, dx2), min(dy1, dy2));
      float res = power / d;
      return clamp(pre + res, 0.0, 1.0);
  }
  float radiation(float pre, vec2 p, float r1, float r2, int num, float power) {
      float angle = 2.0*PI/float(num);
      float d = 1e10;
      for(int i=0; i<360; i++) {
          if (i>=num) break;
          float _d = (r1<p.y && p.y<r2) ? 
              abs(p.x) : 
              min(length(p-vec2(0.0, r1)), length(p-vec2(0.0, r2)));
          d = min(d, _d);
          p = rotate(p, angle);
      }
      float res = power / d;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=compassShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
