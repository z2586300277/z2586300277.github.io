---
title: "粒子线 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `onMouseMove`、`onMouseDown`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,粒子线,粒子"
outline: deep
---

# 粒子线

*Wire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleWire)


![粒子线](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleWire.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `onMouseMove`、`onMouseDown`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `onMouseMove()` — 材质 / GLSL
- `onMouseDown()` — 材质 / GLSL
- `onMouseUp()` — 材质 / GLSL
- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float uTime;
        uniform vec2 uMouse;
        attribute vec3 velocity;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            vPosition = position;
            vec3 pos = position;
            float dist = length(pos.xy - uMouse);
            float influence = 1.0 - clamp(dist / 2.0, 0.0, 1.0);
            pos.xy += uMouse * influence * 0.1;
            pos += velocity * sin(uTime + position.x * 2.0);
            pos.y += sin(uTime * 0.5 + position.x) * 0.2;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
   
```

### 片元

- `time` uniform 驱动动画

```glsl
uniform float uTime;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            float distanceToCenter = length(gl_PointCoord - vec2(0.5));
            if (distanceToCenter > 0.5) discard;
            vec3 baseColor = vec3(0.3, 0.6, 1.0);
            vec3 pulseColor = vec3(1.0, 0.4, 0.8);
            vec3 color = mix(baseColor, pulseColor, vDistance);
            color = color + 0.2 * sin(uTime + vPosition.xyx + vec3(0,2,4));
            float alpha = 1.0 - distanceToCenter * 2.0;
            alpha *= 0.8 + 0.2 * sin(uTime * 2.0);
           
```

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            vPosition = position;
            vec3 pos = position;
            float dist = length(pos.xy - uMouse);
            float influence = 1.0 - clamp(dist / 2.0, 0.0, 1.0);
            pos.xy += uMouse * influence * 0.1;
            pos.y += sin(uTime * 0.5 + position.x) * 0.2;
            vDistance = influence;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
```

### 片元

- 片元输出 gl_FragColor
- `time` uniform 驱动动画

```glsl
uniform float uTime;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            vec3 baseColor = vec3(0.3, 0.6, 1.0);
            vec3 pulseColor = vec3(1.0, 0.4, 0.8);
            vec3 color = mix(baseColor, pulseColor, vDistance);
            color = color + 0.2 * sin(uTime + vPosition.xyx + vec3(0,2,4));
            float alpha = 0.15 + 0.1 * vDistance;
            alpha *= 0.8 + 0.2 * sin(uTime * 2.0);
            gl_FragColor = vec4(color, alpha);
        }
```

## 源码

```js
import * as THREE from 'three'

const container = document.getElementById('box');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

const particlesGeometry = new THREE.BufferGeometry();

const particleCount = 300;

const posArray = new Float32Array(particleCount * 3);

const velocityArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) { 
    
    posArray[i] = (Math.random() - 0.5) * 8; velocityArray[i] = (Math.random() - 0.5) * 0.02;

}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3)); 

particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));

const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        attribute vec3 velocity;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            vPosition = position;
            vec3 pos = position;
            float dist = length(pos.xy - uMouse);
            float influence = 1.0 - clamp(dist / 2.0, 0.0, 1.0);
            pos.
```

