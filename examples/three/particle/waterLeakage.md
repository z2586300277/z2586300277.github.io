---
title: "水流粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `SplashParticle`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,水流粒子"
outline: deep
---
# 水流粒子

*Water Leakage*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=waterLeakage)

![水流粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/waterLeakage.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `SplashParticle`。

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

- **`createMesh()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.0000001, 100000) // 调整相机的近裁剪面为更小的值，让近距离的粒子可见
camera.position.set(10, 10, 5)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AxesHelper(10))

const mesh = createMesh()
scene.add(mesh)

function animate() {
    mesh.render()
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

/* 方法 */
function createMesh() {

    const params = {
        maxParticles: 3000,
        spawnRate: 12,
        gravity: 10,
        minSize: 0.5,
        maxSize: 1,
        minStrength: 1,
        maxStrength: 4,
        spread: 0.6,
        burstProbability: 0.7,
        burstMultiplier: 3,
        color: "#9da7af",
        blendingMode: "Additive",
        rainLength: 0.6,
        opacity: 0.6,
        collisionY: 0,      // 改名为collisionY，表示碰撞高度，而不是地面
        enableSplash: true,
        splashParticles: 6,
        splashSize: 0.3,
        splashSpeed: 3,
        splashLifeTime: 0.6
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
    particlePhysicsFolder.add(params, 'spread').name('发散程度').step(0.01).max(1).min(0)

    const particleVisualFolder = gui.addFolder('视觉属性');
    particleVisualFolder.add(params, 'minSize').name('最小粒子尺寸');
    particleVisualFolder.add(params, 'maxSize').name('最大粒子尺寸');
    particleVisualFolder.addColor(params, 'color').name('粒子颜色').onChange(value => {
        emitter.material.uniforms.color.value.set(value);
        splashSystem.material.uniforms.color.value.set(value); // 同步更新水花颜色
    });
    particleVisualFolder.add(params, 'burstProbability').name('突发概率');
    particleVisualFolder.add(params, 'burstMultiplier').name('突发倍数');
    particleVisualFolder.add(params, 'blendingMode', ['Additive', 'Normal']).name('混合模式').onChange(value => {
        emitter.material.blending = value === 'Additive' ? THREE.AdditiveBlending : THREE.NormalBlending;
        emitter.material.needsUpdate = true;
    });
    particleVisualFolder.add(params, 'rainLength', 0.1, 1.0).name('雨滴长度').onChange(value => {
        emitter.material.uniforms.rainLength.value = value;
    });
    particleVisualFolder.add(params, 'opacity', 0.1, 1.0).step(0.1).name('整体透明度').onChange(value => {
        emitter.material.uniforms.globalOpacity.value = value;
        splashSystem.material.uniforms.globalOpacity.value = value; // 同步更新水花透明度
    });

    const splashFolder = gui.addFolder('水花效果');
    splashFolder.add(params, 'enableSplash').name('启用水花效果');
    splashFolder.add(params, 'splashParticles', 1, 15).step(1).name('水花粒子数');
    splashFolder.add(params, 'splashSize', 0.1, 1.0).name('水花大小');
    splashFolder.add(params, 'splashSpeed', 1, 10).name('水花飞溅速度');
    splashFolder.add(params, 'splashLifeTime', 0.1, 2.0).name('水花生命时间');
    splashFolder.add(params, 'collisionY').name('碰撞高度'); // 修改名称
    splashFolder.open();

    particleFolder.open();
    particlePhysicsFolder.open();
    particleVisualFolder.open();

    class SplashParticle {
        constructor(position) {
            this.position = position.clone();
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * params.splashSpeed;
            this.velocity = new THREE.Vector3(
                Math.cos(angle) * speed,
                Math.random() * speed * 0.8 + speed * 0.5,
                Math.sin(angle) * speed
            );
            this.life = 0;
            this.maxLife = params.splashLifeTime * (0.7 + Math.random() * 0.6);
            this.size = params.splashSize * (0.5 + Math.random() * 0.5);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=waterLeakage) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
