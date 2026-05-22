---
title: "真实火焰 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。使用claude 3.7 sonnect 帮助实现。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,真实火焰"
outline: deep
---
# 真实火焰

*Real Fire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=realFire)

![真实火焰](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/realFire.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。使用claude 3.7 sonnect 帮助实现。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createRealisticFire()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
      baseColor: { value: fireConfig.colors.inner },
      midColor: { value: fireConfig.colors.mid },
      tipColor: { value: fireConfig.colors.outer },
      smokeColor: { value: fireConfig.colors.smoke }
    },
    vertexShader: `
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
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // 粒子大小随高度和生命周期变化
        gl_PointSize = size * (1.0 - age) * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
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
          color = mix(baseColor, midColor, age / 0.3);
        } else if (age < 0.8) {
          color = mix(midColor, tipColor, (age - 0.3) / 0.5);
        } else {
          color = mix(tipColor, smokeColor, (age - 0.8) / 0.2);
        }
        
        // 边缘透明度渐变，提高真实感
        float alpha = (1.0 - dist) * (1.0 - age);
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    blending: THREE.AdditiveBlending,  // 加法混合，增强光照效果
    depthWrite: false,                 // 禁用深度写入
    transparent: true,                 // 启用透明
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=realFire) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
