---
title: "喷泉水流 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,喷泉水流"
outline: deep
---
# 喷泉水流

*Water Flow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=waterFlowParticle)

![喷泉水流](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/waterFlowParticle.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`buildGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 5, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// 可配置参数
const config = {
    count: 3000,
    nozzleX: 0,
    nozzleY: 6,
    velocityX: 1.5,
    velocityY: 2.0,
    spread: 1.5,
    gravity: 10,
    particleSize: 0.15,
    lifeTime: 2.0,
}

const uniforms = {
    time: { value: 0 },
    nozzlePos: { value: new THREE.Vector3(config.nozzleX, config.nozzleY, 0) },
    velocity: { value: new THREE.Vector2(config.velocityX, config.velocityY) },
    spread: { value: config.spread },
    gravity: { value: config.gravity },
    lifeTime: { value: config.lifeTime },
}

const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
        attribute float size;
        attribute float phase;
        attribute vec3 randomVel;
        uniform float time;
        uniform vec3 nozzlePos;
        uniform vec2 velocity;
        uniform float spread;
        uniform float gravity;
        uniform float lifeTime;
        varying float vAlpha;
        
        void main() {
            // 粒子生命周期（循环）
            float age = mod(time + phase, lifeTime);
            float ageRatio = age / lifeTime;
            
            // 初始位置 + 随机偏移
            vec3 pos = nozzlePos;
            pos.x += randomVel.x * 0.2;
            pos.y += randomVel.y * 0.2;
            pos.z += randomVel.z * 0.3;
            
            // 初始速度 + 随机扩散
            vec3 vel = vec3(velocity.x, velocity.y, 0.0);
            vel += randomVel * spread;
            
            // 受重力的抛物运动
            pos += vel * age;
            pos.y -= 0.5 * gravity * age * age;
            
            // 透明度：开始淡入，结束淡出
            vAlpha = smoothstep(0.0, 0.05, ageRatio) * (1.0 - smoothstep(0.85, 1.0, ageRatio));
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (250.0 / -mvPosition.z);
        }
    `,
    fragmentShader: `
        uniform sampler2D map;
        varying float vAlpha;
        
        void main() {
            vec4 texColor = texture2D(map, gl_PointCoord);
            gl_FragColor = vec4(texColor.rgb, texColor.a * vAlpha);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

// 生成纹理
const c = document.createElement('canvas')
c.width = c.height = 32
const ctx = c.getContext('2d')
const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
g.addColorStop(0, 'rgba(200,235,255,1)')
g.addColorStop(1, 'rgba(120,190,255,0)')
ctx.fillStyle = g
ctx.fillRect(0, 0, 32, 32)
uniforms.map = { value: new THREE.CanvasTexture(c) }

function buildGeometry() {
    const geo = new THREE.BufferGeometry()
    const positions = [], sizes = [], phases = [], randomVels = []
    
    for (let i = 0; i < config.count; i++) {
        positions.push(0, 0, 0)
        sizes.push(config.particleSize * (0.8 + Math.random() * 0.4))
        phases.push(Math.random() * config.lifeTime) // 错开生成时间
        randomVels.push(
            (Math.random() - 0.5),
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.8
        )
    }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=waterFlowParticle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
