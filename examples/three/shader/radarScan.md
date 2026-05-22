---
title: "雷达扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,雷达扫描"
outline: deep
---
# 雷达扫描

*Radar Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=radarScan)

![雷达扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/radarScan.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`update()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000)

camera.position.set(0, 800, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 定义雷达参数
const radarData = {
  position: {
    x: 0,
    y: 20,
    z: 0
  },
  radius: 240,
  color: '#f005f0',
  opacity: 0.5,
  speed: 300,
  followWidth: 220
}

// 创建几何体
const circleGeometry = new THREE.CircleGeometry(radarData.radius, 1000)
const rotateMatrix = new THREE.Matrix4().makeRotationX((-Math.PI / 180) * 90)
circleGeometry.applyMatrix4(rotateMatrix)

// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: radarData.color,
  opacity: radarData.opacity,
  transparent: true
})

const radar = new THREE.Mesh(circleGeometry, material)
radar.updateMatrix()

scene.add(radar)

material.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, {
    uSpeed: {
      value: radarData.speed
    },
    uRadius: {
      value: radarData.radius
    },
    uTime: {
      value: 0
    },
    uFollowWidth: {
      value: radarData.followWidth
    }
  })

  requestAnimationFrame(function update(time) {
    shader.uniforms.uTime.value = time / 1000
    requestAnimationFrame(update)
  })

  const vertex = `

      varying vec3 vPosition;
      void main() {

        vPosition = position;

    `
  shader.vertexShader = shader.vertexShader.replace('void main() {', vertex)
  const fragment = `

      uniform float uRadius;     
      uniform float uTime;            
      uniform float uSpeed; 
      uniform float uFollowWidth; 
      varying vec3 vPosition;
     

      float calcAngle(vec3 oFrag){

        float fragAngle;

        const vec3 ox = vec3(1,0,0);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=radarScan) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
