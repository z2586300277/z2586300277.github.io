---
title: "能量球 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`createBuildings`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,能量球,着色器"
outline: deep
---

# 能量球

*Energy Ball*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=energyBallShader)


![能量球](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/energyBallShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`createBuildings`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
```

### 片元

- 片元输出 gl_FragColor
- `time` uniform 驱动动画

```glsl
uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center);
      float pulse = sin(time * 2.0) * 0.5 + 0.5;
      float alpha = smoothstep(0.5, 0.0, dist) * pulse;
      vec3 finalColor = mix(color, vec3(1.0), 1.0 - dist);
      gl_FragColor = vec4(finalColor, alpha);
    }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 创建城市建筑物
const createBuildings = () => {
  const buildings = new THREE.Group()
  const buildingCount = 50
  
  for(let i = 0; i < buildingCount; i++) {
    const height = Math.random() * 5 + 1
    const geometry = new THREE.BoxGeometry(1, height, 1)
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff })
    
    const building = new THREE.Mesh(geometry, material)
    building.position.set((Math.random() - 0.5) * 20, height / 2, (Math.random() - 0.5) * 20)
    buildings.add(building)
  }
  
  scene.add(buildings)
}

// 创建能量球着色器
const energyBallShader = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0.0 }, color: { value: new THREE.Color(1.0, 0.5, 0.0) } },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Pos
```

