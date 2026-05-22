---
title: "爱心 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `LoveParticlesWorld`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,爱心"
outline: deep
---
# 爱心

*Love Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=loveShader)

![爱心](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/loveShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 天空盒与环境贴图
- 点云 / 粒子 / 实例化渲染
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `LoveParticlesWorld`。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

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
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }
  
  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 100
    );
    this.camera.position.z = 4.5;
    this.scene.add(this.camera);
  }
  
  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(this.renderer.domElement);
  }
  
  // 创建爱心粒子 - 增大粒子尺寸和发光强度
  createHeart() {
    const heartMaterial = new THREE.ShaderMaterial({
      fragmentShader: `
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
      `,
      vertexShader: `
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
          t = sign * mod(-uTime * aSpeed * 0.004 + 9.0 * aSpeed * aSpeed, PI);
          
          float a = pow(t, 2.0) * pow((t - sign * PI), 2.0);
          float r = 0.16 * scale; // 增大基础大小
          
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=loveShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
