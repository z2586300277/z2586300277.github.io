---
title: "爱心 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `LoveParticlesWorld`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,爱心,着色器"
outline: deep
---

# 爱心

*Love Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=loveShader)


![爱心](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/loveShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `LoveParticlesWorld`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 大量重复物体用 `InstancedMesh`，一次 draw call；矩阵写 `setMatrixAt`。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### LoveParticlesWorld

- `constructor()` — 初始化成员
- `initScene()`
- `createGradientTexture()`
- `initCamera()`
- `initRenderer()` — 材质 / GLSL
- `createHeart()` — 材质 / GLSL
- `createStars()` — 材质 / GLSL
- `createGlow()` — 材质 / GLSL
- `addEvents()`
- `addUIElements()`
- `animate()` — 材质 / GLSL

## 着色器

### 片元

- 片元输出 gl_FragColor

```glsl
varying vec3 vColor;
        varying vec2 vUv;
        varying float vIntensity;
        
        void main() {
          // 更强的发光效果
          float strength = 1.0 - 2.0 * distance(vUv, vec2(0.5));
          strength = pow(strength, 1.4); // 更柔和的边缘
          
          // 增强发光和颜色饱和度
          vec3 finalColor = vColor * (1.0 + vIntensity * 0.8);
          
          // 更亮的白色光晕
          finalColor += vec3(1.0) * pow(strength, 6.0) * 0.4;
          
          gl_FragColor = vec4(finalColor * strength, strength);
        }
```

### 顶点

```glsl
#define PI 3.1415926535897932384626433832795
        uniform float uTime;
        uniform float uSize;
        
        attribute float aScale;
        attribute vec3 aColor;
        attribute float aSpeed;
        attribute float aOffset;
        attribute float aPhase;
        
        varying vec3 vColor;
        varying vec2 vUv;
        varying float vIntensity;
        
        vec3 heartShape(float t, float scale) {
          t = aPhase + sin(uTime * 0.2) * 0.05;
          
          float sign = 2.0 * (step(0.5, aOffset) - 0.5);
          t = sign * mod(-uTime * aSpee
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying vec3 vColor;
        varying float vSize;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          vec3 finalColor = vColor * pow(strength, 1.5) * 1.5;
          gl_FragColor = vec4(finalColor, strength * 0.8);
        }
```

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float uTime;
        attribute float aSize;
        attribute vec3 aColor;
        attribute float aSpeed;
        
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          vec3 pos = position;
          
          // 闪烁效果
          float flicker = 0.8 + 0.5 * sin(uTime * aSpeed + position.x * 100.0);
          
          // 轻微漂浮
          pos.x += sin(uTime * 0.1 * aSpeed + position.y) * 0.15;
          pos.y += cos(uTime * 0.1 * aSpeed + position.x) * 0.15;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying float vIntensity;
        varying vec3 vColor;
        
        void main() {
          float alpha = pow(vIntensity, 2.5) * 0.55;
          gl_FragColor = vec4(vColor, alpha);
        }
```

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float uTime;
        varying float vIntensity;
        varying vec3 vColor;
        
        void main() {
          vec3 pos = position;
          float noise = sin(pos.x * 5.0 + uTime) * sin(pos.y * 5.0 + uTime) * sin(pos.z * 5.0 + uTime) * 0.15;
          pos += normal * noise;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          vIntensity = 1.0 - length(pos) / 2.0;
          vColor = vec3(0.95, 0.4, 0.7);
        }
```

## 源码

```js
import * as THREE from "three";
import { gsap } from "gsap";

class LoveParticlesWorld {
  constructor() {
    // 基本参数设置 - 增大粒子数量和默认尺寸
    this.params = {
      heartParticles: 1800,
      starParticles: 700,
      colorCycle: 0
    };
    
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.createHeart();
    this.createStars();
    this.createGlow();
    this.addEvents();
    
    this.clock = new THREE.Clock();
    this.animate();
    this.addUIElements();
  }
  
  // 场景初始化
  initScene() {
    this.scene = new THREE.Scene();
    
    // 创建更丰富的渐变背景
    const bgColors = [new THREE.Color(0x1a0033), new THREE.Color(0x000022)];
    const bgTexture = this.createGradientTexture(bgColors);
    this.scene.background = bgTexture;
    
    // 增强光源
    this.scene.add(new THREE.AmbientLight(0x404040, 1.8));
    
    this.pointLight = new THREE.PointLight(0xff3388, 1.5, 100);
    this.pointLight.position.set(0, 0, 5);
    this.scene.add(this.pointLight);
  }
  
  createGradientTexture(colors) {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, colors[0].getStyle());
    gradient.addColorStop(1, colors[1].getStyle());
    contex
```

