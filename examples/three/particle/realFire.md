---
title: "真实火焰 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。使用claude 3.7 sonnect 帮助实现。主流程在 `createRealisticFire`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,真实火焰,粒子"
outline: deep
---

# 真实火焰

*Real Fire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=realFire)


![真实火焰](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/realFire.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。使用claude 3.7 sonnect 帮助实现。主流程在 `createRealisticFire`、`animate`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
attribute float size;
      attribute float life;
      attribute float phase;
      attribute vec3 velocity;
      uniform float time;
      varying float vLife;
      varying float vPhase;
      
      void main() {
        vLife = life;
        vPhase = phase;
        
        // 计算粒子当前生命周期
        float age = mod(time + phase, 1.0);
        
        // 位置随时间变化
        vec3 pos = position + velocity * age;
        
        // 添加水平摆动效果，随生命周期衰减
        float wiggle = sin(age * 20.0 + phase * 10.0) * (1.0 - age) * 0.2;
        pos.x += wiggle;
        
        vec4 mvPosi
```

### 片元

```glsl
uniform vec3 baseColor;
      uniform vec3 midColor;
      uniform vec3 tipColor;
      uniform vec3 smokeColor;
      varying float vLife;
      varying float vPhase;
      
      void main() {
        // 计算到粒子中心的距离，用于圆形粒子效果
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center) * 2.0;
        
        // 丢弃边缘像素创建圆形粒子
        if (dist > 1.0) discard;
        
        // 基于生命周期混合颜色
        vec3 color;
        float age = vLife;
        
        // 颜色过渡: 亮黄 -> 橙色 -> 红色 -> 烟雾色
        if (age < 0.3) {
          color = mix(baseColor, midColor, age / 0
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 初始化场景
const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 6)

// 设置渲染器
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true, 
  logarithmicDepthBuffer: true 
})
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * 创建真实火焰效果
 * @returns {Object} 包含火焰组和火焰材质的对象
 */
function createRealisticFire() {
  // 火焰配置参数
  const fireConfig = {
    particleCount: 1500,    // 粒子数量
    particleSize: 0.5,      // 粒子基础大小
    baseHeight: 5,          // 火焰高度
    baseRadius: 1.2,        // 火焰底部半径
    colors: {
      inner: new THREE.Color(0xffff80),  // 内焰颜色 - 亮黄色
      mid: new THREE.Color(0xff8000),    // 中焰颜色 - 橙色
      outer: new THREE.Color(0xff4400),  // 外焰颜色 - 红色
      smoke: new THREE.Color(0x111111)   // 烟雾颜色 - 深灰色
    },
    velocityFactor: 0.6,    // 上升速度系数
    wiggleFactor: 0.2       // 横向摇摆系数
  };

  // 火焰着色器材质
  const fireMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { v
```

