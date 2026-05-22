---
title: "粒子聚散 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子聚散"
outline: deep
---
# 粒子聚散

*Scattered*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleScattered)

![粒子聚散](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleScattered.jpg)

## 你将学到什么

- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- Tween 补间动画
- requestAnimationFrame 渲染循环

## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。

> 粒子 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

- 属性插值动画，适合相机动效、UI 过渡。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`createParticleAnimation1()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createParticleAnimation2()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as TWEEN from "@tweenjs/tween.js";

const DOM = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)
camera.position.set(5, 5, 12)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
DOM.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.01

window.onresize = () => {
    renderer.setSize(DOM.clientWidth, DOM.clientHeight)
    camera.aspect = DOM.clientWidth / DOM.clientHeight
    camera.updateProjectionMatrix()
}

scene.add(new THREE.AxesHelper(1000))

let particles = null
let particleSystem = null;
animate()
createParticleAnimation1()
createParticleAnimation2()

function animate() {
    controls.update()
    TWEEN.update();
    particleSystem && (particleSystem.rotation.y += 0.2)
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function createParticleAnimation1() {
    // 创建粒子
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 3) {
        positions[i] = THREE.MathUtils.randFloat(-4, 4);
        positions[i + 1] = THREE.MathUtils.randFloat(-4, 4);
        positions[i + 2] = THREE.MathUtils.randFloat(5, 10);

        colors[i] = 253;
        colors[i + 1] = 253;
        colors[i + 2] = 0.2;
    }

    particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    const particleTexture = new THREE.TextureLoader().load(HOST + '/files/images/particle.jpg');
    const pointMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        map: particleTexture,
        alphaMap: particleTexture,
        alphaTest: 0.001,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    particles = new THREE.Points(particlesGeometry, pointMaterial);
    scene.add(particles);

    const particleStartPositions = particlesGeometry.getAttribute("position");
    for (let i = 0; i < particleStartPositions.count; i++) {
        const tween = new TWEEN.Tween(positions);
        tween.to(
            {
                [i * 3]: 0,
                [i * 3 + 1]: 0,
                [i * 3 + 2]: 0,
            },
            5000 * Math.random()
        );

        tween.easing(TWEEN.Easing.Exponential.In);
        tween.delay(2000);
        tween.onUpdate(() => {
            particleStartPositions.needsUpdate = true;
        })

        tween.start();
    }
}

function createParticleAnimation2() {
    // 创建粒子系统
    const particleCount = 2000; // 粒子数量
    const particles = new THREE.BufferGeometry();
    const particleTexture = new THREE.TextureLoader().load(HOST + '/files/images/particle.jpg');
    const pointMaterial = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        map: particleTexture,
        alphaMap: particleTexture,
        alphaTest: 0.001,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    });

    const cubeWidth = 0.5;
    const cubeHeight = 2;
    const positions = new Float32Array(particleCount * 3);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleScattered) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
