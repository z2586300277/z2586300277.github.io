---
title: "水流粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `SplashParticle`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,水流粒子,粒子"
outline: deep
---

# 水流粒子

*Water Leakage*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=waterLeakage)


![水流粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/waterLeakage.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `SplashParticle`。

> 粒子 · Three.js

## 实现思路

**自定义 shader**：看 `uniforms` 默认值和片元/顶点主逻辑，rAF 里改 time 等 uniform。

**粒子**：批量点/面片，注意 update 频率和 draw call。

## 类与方法

### SplashParticle

- `constructor()` — 参数：position
- `update()` — 每帧更新 geometry uniform 或实例矩阵

### SplashSystem

- `constructor()` — 参数：maxCount = 1000
- `addSplash()`
- `update()` — 每帧更新 geometry uniform 或实例矩阵

### Particle

- `constructor()` — 初始化成员
- `update()` — 每帧更新 geometry uniform 或实例矩阵

### ParticleSystem

- `constructor()` — 参数：maxCount = params.maxParticles
- `spawn()`
- `update()` — 每帧更新 geometry uniform 或实例矩阵

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
attribute float size;
                attribute float opacity;
                varying float vOpacity;
                void main() {
                    vOpacity = opacity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                    // 改进粒子大小计算，防止在近距离时粒子消失
                    float distance = max(length(mvPosition.xyz), 0.1); // 防止除以接近0的值
                    float scale = 300.0 / distance;
                    
                    // 限制最大缩放比例，防止过近时粒子过大
                    scale = min(scale, 50.0);
                    
         
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform vec3 color;
                uniform float globalOpacity;
                varying float vOpacity;
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(gl_PointCoord, center);
                    float alpha = smoothstep(0.5, 0.2, dist) * vOpacity * globalOpacity;
                    if (alpha < 0.01) discard;
                    gl_FragColor = vec4(color, alpha);
                }
```

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
attribute float size;
                attribute float opacity;
                varying float vOpacity;
                void main() {
                    vOpacity = opacity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // 改进粒子大小计算，防止在近距离时粒子消失
                    float distance = max(length(mvPosition.xyz), 0.1); // 防止除以接近0的值
                    float scale = 300.0 / distance;
                    
                    // 限制最大缩放比例，防止过近时粒子过大
                    scale = min(scale, 50.0);
                    
     
```

### 片元

```glsl
uniform vec3 color;
                uniform float rainLength;
                uniform float globalOpacity;
                varying float vOpacity;
                void main() {
                    vec2 center = vec2(0.5, 0.5);
                    vec2 uv = gl_PointCoord - center;
                    float width = 0.05;
                    float y_offset = (gl_PointCoord.y - 0.5) * 2.0;
                    float shape = step(abs(uv.x), width * (1.0 - pow(y_offset, 2.0)));
                    shape *= step(gl_PointCoord.y, 0.5 + rainLength / 2.0) * step(0.5 - rainLength / 2.0, gl_Point
```

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
```

### 方法

```js
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
    particl
```

