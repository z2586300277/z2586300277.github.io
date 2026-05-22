---
title: "建筑渐变 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,建筑渐变,着色器"
outline: deep
---

# 建筑渐变

*Building Gradient*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=buildGradient)


![建筑渐变](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/buildGradient.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform vec3 uColorBottom;
        uniform vec3 uColorTop;
        uniform float uMinY;
        uniform float uMaxY;
        uniform float uTime;
        
        varying vec3 vColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            // 设置UV坐标，类似原始着色器中的缩放方式
            vUv = vec2(position.x / 80.0, position.y / 250.0);
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            // 基础渐变效果
            float factor = smoothstep(uMinY, uMaxY, pos
```

### 片元

- `time` uniform 驱动动画

```glsl
uniform vec3 uColorBottom;
        uniform vec3 uColorTop;
        uniform vec3 uSweepColor;
        uniform float uTime;
        uniform vec3 uLightDir;
        uniform float uScanWidth;
        uniform float uScanSoftness;
        
        varying vec3 vColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // 随机函数，与原始着色器相同
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        // 叠加混合函数 - 让扫描颜色与基础渐变叠加
        vec3 blendOverlay(vec3
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(1, 1, 1)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true , logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio)
box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        uniform vec3 uColorBottom;
        uniform vec3 uColorTop;
        uniform float uMinY;
        uniform float uMaxY;
        uniform float uTime;
        
        varying vec3 vColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            // 设置UV坐标，类似原始着色器中的缩放方式
            vUv = vec2(position.x / 80.0, position.y / 250.0);
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            // 基础渐变效果
            float 
```

