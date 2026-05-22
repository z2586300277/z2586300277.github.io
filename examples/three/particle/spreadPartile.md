---
title: "发散粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Particle`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,发散粒子"
outline: deep
---
# 发散粒子

*Spread Partile*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=spreadPartile)

![发散粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/spreadPartile.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Particle`。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(1, 1, 1)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const params = {
    maxParticles: 8000,
    spawnRate: 12,
    gravity: 10,
    minSize: 0.01,
    maxSize: 0.1,
    minStrength: 1,
    maxStrength: 4,
    spread: 0.3,
    burstProbability: 0.7,
    burstMultiplier: 3,
    color: "#66ccff",
    blendingMode: "Additive"
}

// 设置UI
const gui = new GUI();
const particleFolder = gui.addFolder('粒子系统');
particleFolder.add(params, 'maxParticles').name('最大粒子数').onChange(value => {
    scene.remove(emitter.points);
    emitter = new ParticleSystem(value);
    scene.add(emitter.points);
});
particleFolder.add(params, 'spawnRate').name('生成速率');

const particlePhysicsFolder = gui.addFolder('物理属性');
particlePhysicsFolder.add(params, 'gravity').name('重力');
particlePhysicsFolder.add(params, 'minStrength').name('最小喷射强度');
particlePhysicsFolder.add(params, 'maxStrength').name('最大喷射强度');
particlePhysicsFolder.add(params, 'spread').name('发散程度');

const particleVisualFolder = gui.addFolder('视觉属性');
particleVisualFolder.add(params, 'minSize').name('最小粒子尺寸');
particleVisualFolder.add(params, 'maxSize').name('最大粒子尺寸');
particleVisualFolder.addColor(params, 'color').name('粒子颜色').onChange(value => {
    emitter.material.uniforms.color.value.set(value);
});
particleVisualFolder.add(params, 'burstProbability').name('突发概率');
particleVisualFolder.add(params, 'burstMultiplier').name('突发倍数');
particleVisualFolder.add(params, 'blendingMode', ['Additive', 'Normal']).name('混合模式').onChange(value => {
    emitter.material.blending = value === 'Additive' ? THREE.AdditiveBlending : THREE.NormalBlending;
    emitter.material.needsUpdate = true;
});

particleFolder.open();
particlePhysicsFolder.open();
particleVisualFolder.open();

const clock = new THREE.Clock()

class Particle {
    constructor() {
        this.position = new THREE.Vector3();
        const angle = Math.random() * Math.PI * 2;
        const strength = Math.random() * (params.maxStrength - params.minStrength) + params.minStrength;
        const spread = Math.random() * params.spread;
        this.velocity = new THREE.Vector3(
            Math.cos(angle) * spread * strength,
            Math.random() * strength + 2,
            Math.sin(angle) * spread * strength
        );
        this.life = 0;
        this.maxLife = 1 + Math.random() * 0.5;
        this.size = this.initialSize = Math.random() * (params.maxSize - params.minSize) + params.minSize;
    }
    update(delta) {
        this.velocity.y -= params.gravity * delta * 0.5;
        this.position.addScaledVector(this.velocity, delta);
        this.life += delta;
        const lifeRatio = this.life / this.maxLife;
        this.size = this.initialSize * (1 - lifeRatio * 0.5);
    }
}

class ParticleSystem {
    constructor(maxCount = params.maxParticles) {
        this.maxCount = maxCount;
        this.particles = [];
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.maxCount * 3);
        this.sizes = new Float32Array(this.maxCount);
        this.opacities = new Float32Array(this.maxCount);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
        this.geometry.setAttribute('opacity', new THREE.BufferAttribute(this.opacities, 1));
        this.geometry.setDrawRange(0, 0);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: new THREE.TextureLoader().load('https://z2586300277.github.io/three-editor/dist/files/channels/snow.png') },
                color: { value: new THREE.Color(params.color) }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                varying float vOpacity;
                void main() {
                    vOpacity = opacity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                uniform vec3 color;
                varying float vOpacity;
                void main() {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=spreadPartile) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
