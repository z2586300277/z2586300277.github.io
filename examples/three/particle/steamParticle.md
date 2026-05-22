---
title: "蒸汽粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,蒸汽粒子"
outline: deep
---
# 蒸汽粒子

*Steam Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=steamParticle)

![蒸汽粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/steamParticle.jpg)

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

// 初始化场景
const box = document.getElementById('box')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x445566)

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 8, 20)

// 设置渲染器
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true 
})
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// 可配置参数
const config = {
    particleCount: 3000,
    particleSize: 1.2,
    width: 12,
    depth: 2,
    height: 15,
    riseSpeed: 0.4,
    spread: 0.3,
    turbulence: 0.3,
    density: 0.4,
}

const uniforms = {
    time: { value: 0 },
    baseColor: { value: new THREE.Color(0xffffff) },
    height: { value: config.height },
    turbulence: { value: config.turbulence },
    density: { value: config.density },
}

const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
        attribute float size;
        attribute float phase;
        attribute vec3 velocity;
        uniform float time;
        uniform float height;
        uniform float turbulence;
        varying float vAlpha;
        varying float vAge;
        void main() {
            float age = mod(time * 0.3 + phase, 1.0);
            vAge = age;
            vec3 pos = position + velocity * age * height;
            pos.x += sin(age * 8.0 + phase * 20.0) * turbulence * (0.5 + age);
            pos.z += cos(age * 6.0 + phase * 15.0) * turbulence * (0.3 + age * 0.5);
            pos.x *= (1.0 + age * 1.5);
            pos.z *= (1.0 + age * 0.8);
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (1.0 + age * 3.0) * (250.0 / -mvPosition.z);
            float fadeIn = smoothstep(0.0, 0.1, age);
            float fadeOut = 1.0 - smoothstep(0.6, 1.0, age);
            vAlpha = fadeIn * fadeOut;
        }
    `,
    fragmentShader: `
        uniform vec3 baseColor;
        uniform float density;
        varying float vAlpha;
        varying float vAge;
        void main() {
            float dist = length(gl_PointCoord - 0.5) * 2.0;
            if (dist > 1.0) discard;
            float edge = 1.0 - smoothstep(0.3, 1.0, dist);
            vec3 color = mix(baseColor, vec3(0.85, 0.88, 0.92), vAge * 0.3);
            gl_FragColor = vec4(color, vAlpha * edge * density);
        }
    `,
    blending: THREE.NormalBlending,
    depthWrite: false,
    transparent: true,
})

function buildGeometry() {
    const geo = new THREE.BufferGeometry()
    const positions = [], sizes = [], phases = [], velocities = []
    for (let i = 0; i < config.particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * config.width,
            Math.random() * 0.3,
            (Math.random() - 0.5) * config.depth
        )
        sizes.push(config.particleSize * (0.6 + Math.random() * 0.8))
        phases.push(Math.random())
        velocities.push(
            (Math.random() - 0.5) * config.spread,
            config.riseSpeed * (0.8 + Math.random() * 0.4),
            (Math.random() - 0.5) * config.spread * 0.5
        )
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geo.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1))
    geo.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3))
    return geo
}

const steam = new THREE.Points(buildGeometry(), material)
scene.add(steam)

// GUI
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=steamParticle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
