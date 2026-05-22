---
title: "蘑菇 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,蘑菇,着色器"
outline: deep
---

# 蘑菇

*Mushroom*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=mushroom)


![蘑菇](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/mushroom.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `render`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `render()` — renderer.render(scene, camera)

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
    void main(){
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
        vUv=uv;
    }
```

### 片元

- `time` uniform 驱动动画

```glsl
#ifdef GL_ES
    precision mediump float;
    #endif
    uniform vec2 Resolution;
    uniform vec3 Mouse;
    uniform float Time;
    varying vec2 vUv;
    
    mat2 rot2D(float angle){
      float s=sin(angle);
      float c=cos(angle);
      return mat2(c,-s,s,c);
    }
    
    float sdCutHollowSphere(vec3 p,float r,float h,float t)
    {
      float w=sqrt(r*r-h*h);
      vec2 q=vec2(length(p.xz),p.y);
      return((h*q.x<w*q.y)?length(q-vec2(w,h)):
      abs(length(q)-r))-t;
    }
    vec4 sdstripe(vec3 p,vec3 color){
      p.xz=abs(p.xz);
      float d1=sdCutHollow
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, DOM.clientWidth / DOM.clientHeight, 0.1, 100000)
camera.position.set(10, 10, 10)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio * 2)
renderer.setClearColor(0x000000)
DOM.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const uniforms = {
    Mouse: {
        type: 'v2',
        value: new THREE.Vector2(0, 0)
    },
    Resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    Time: {
        type: 'f',
        value: 1.0
    }
}

DOM.addEventListener('mousemove', (event) => uniforms.Mouse.value = new THREE.Vector2(
    (event.offsetX / event.target.clientWidth) * 2 - 1,
    -(event.offsetY / event.target.clientHeight) * 2 + 1
))
const geometry = new THREE.BoxGeometry(10, 10, 10);

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `varying vec2 vUv;
    void main(){
        gl_Position=projectionMatrix*modelVie
```

