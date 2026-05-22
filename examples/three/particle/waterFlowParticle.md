---
title: "喷泉水流 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `buildGeometry`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,喷泉水流,粒子"
outline: deep
---

# 喷泉水流

*Water Flow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=waterFlowParticle)


![喷泉水流](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/waterFlowParticle.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `buildGeometry`、`animate`。

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

```glsl
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
           
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform sampler2D map;
        varying float vAlpha;
        
        void main() {
            vec4 texColor = texture2D(map, gl_PointCoord);
            gl_FragColor = vec4(texColor.rgb, texColor.a * vAlpha);
        }
```

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
        uniform float time
```

