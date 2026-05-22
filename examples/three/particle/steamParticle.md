---
title: "蒸汽粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `buildGeometry`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,蒸汽粒子,粒子"
outline: deep
---

# 蒸汽粒子

*Steam Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=steamParticle)


![蒸汽粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/steamParticle.jpg)


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

- 顶点阶段：改 gl_Position 或传 varying

```glsl
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
            pos.x *= (1.0 +
```

### 片元

- 片元输出 gl_FragColor

```glsl
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
```

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
        uniform float tim
```

