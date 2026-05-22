---
title: "粒子线 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子线"
outline: deep
---
# 粒子线

*Wire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleWire)

![粒子线](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleWire.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`onMouseMove()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onMouseDown()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onMouseUp()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
            pos.xy += uMouse * influence * 0.1;
            pos += velocity * sin(uTime + position.x * 2.0);
            pos.y += sin(uTime * 0.5 + position.x) * 0.2;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vDistance = influence;
            gl_PointSize = mix(3.0, 8.0, influence) * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
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
            gl_FragColor = vec4(color, alpha);
        }
    `,
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
    },
    transparent: true,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(particlesGeometry, particleMaterial); scene.add(particleSystem);

const linesMaterial = new THREE.ShaderMaterial({
    vertexShader: `
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
    `,
    fragmentShader: `
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
    `,
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
    },
    transparent: true,
    blending: THREE.AdditiveBlending
});

const linesGeometry = new THREE.BufferGeometry();
const linePositions = [];
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleWire) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
