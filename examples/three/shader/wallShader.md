---
title: "扩散圆墙 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,扩散圆墙"
outline: deep
---

# 扩散圆墙

*Wall Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=wallShader)


![扩散圆墙](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/wallShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

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
varying vec4 vPosition;
      void main() {
        vPosition = modelMatrix * vec4(position,1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform vec3 uColor; // 半径        
      uniform vec3 uMax; 
      uniform vec3 uMin;
      uniform mat4 modelMatrix; // 世界矩阵
      varying vec4 vPosition; // 接收顶点着色传递进来的位置数据
      void main() {
        vec4 uMax_world = modelMatrix * vec4(uMax,1.0);
        vec4 uMin_world = modelMatrix * vec4(uMin,1.0);
        float opacity =1.0 - (vPosition.y - uMin_world.y) / (uMax_world.y -uMin_world.y); 
        gl_FragColor = vec4( uColor, opacity);
      }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

const curve = new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3().setY(3))
const geometry = new THREE.TubeGeometry(curve, 20, 5, 300, false);

geometry.computeBoundingBox()
const { max, min } = geometry.boundingBox

// 创建材质
const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        uMax: { value: max },
        uMin: { value: min },
        uColor: { value: new THREE.Color('#409eff') }
    },
    vertexShader: `
      varying vec4 vPosition;
      void main() {
        vPosition = modelMatrix * vec4(position,1.0);
        gl
```

