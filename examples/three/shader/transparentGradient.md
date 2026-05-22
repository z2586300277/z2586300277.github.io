---
title: "透明渐变 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createStarShape`、`createPolygonShape`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,透明渐变,着色器"
outline: deep
---

# 透明渐变

*Trans Grad*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=transparentGradient)


![透明渐变](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/transparentGradient.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createStarShape`、`createPolygonShape`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

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

```glsl
varying vec2 vUv;
    uniform vec3 color;
    uniform float uvScale;
    uniform float intensity;
    void main() {
      vec2 uv = vUv * uvScale;
      float distance = length(uv);
      float alpha = smoothstep(0.0, 1., distance);
      gl_FragColor = vec4(color * intensity, alpha);
    }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const uniforms = {
    color: { value: new THREE.Color(0xffffff * Math.random()) },
    uvScale: { value: 0.1 },
    intensity: { value: 3 }
}

const material = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    uniform vec3 color;
    uniform float uvScale;
    uniform float intensity;
    void main() {
      vec2 uv = vUv * uvScale;
      float distance = length(uv);
      float alpha = smoothstep(0.0, 1., distance);
      gl_FragColor = vec4(color * intensity, alpha);
    }
  `,
 
```

