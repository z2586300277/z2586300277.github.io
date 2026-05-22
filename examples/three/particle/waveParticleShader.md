---
title: "波浪粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,波浪粒子,粒子"
outline: deep
---

# 波浪粒子

*Wave*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=waveParticleShader)


![波浪粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/waveParticleShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float uTime;
        uniform float uElevation;

        attribute float aSize;
        uniform float bsize;

        varying float vPositionY;
        varying float vPositionZ;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            modelPosition.y = sin(modelPosition.x - uTime) * sin(modelPosition.z * 0.6 + uTime) * uElevation;

            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;

            gl_PointSize = 2.0 * aSize;
            gl_PointSize *= ( 1.0 / 
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying float vPositionY;
        varying float vPositionZ;
        uniform vec3 ucolor;

        void main() {
            float strength = (vPositionY + 0.25) * 0.3;
            gl_FragColor = vec4(ucolor, strength);
        }
```

## 源码

```js
import { BufferAttribute, Clock, Color, PerspectiveCamera, PlaneGeometry, Points, Scene, ShaderMaterial, WebGLRenderer } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new Scene()

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
camera.position.y = 1.1
camera.position.x = 0
scene.add(camera)

const planeGeometry = new PlaneGeometry(20, 20, 150, 150)
const planeMaterial = new ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uElevation: { value: 0.482 },
        ucolor: { value: new Color(0x9ab0f4) },
        bsize: { value: 3 }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uElevation;

        attribute float aSize;
        uniform float bsize;

        varying float vPositionY;
        varying float vPositionZ;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            modelPosition.y = sin(modelPosition.x - uTime) * sin(modelPosition.z * 0.6 + uTime) * uElevation;

            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;

            gl_PointSize = 2.0 * aSize;
            gl_PointSize *= ( 1.0 / - 
```

