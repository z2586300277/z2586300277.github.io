---
title: "发散粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Particle`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,发散粒子,粒子"
outline: deep
---

# 发散粒子

*Spread Partile*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=spreadPartile)


![发散粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/spreadPartile.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Particle`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

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
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform sampler2D pointTexture;
                uniform vec3 color;
                varying float vOpacity;
                void main() {
                    gl_FragColor = texture2D(pointTexture, gl_PointCoord) * vec4(color, 1.0);
                    gl_FragColor.a *= vOpacity;
                }
```

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
particlePhysicsFolder.add(params, 'm
```

