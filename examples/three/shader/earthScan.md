---
title: "地球扫描 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,地球扫描,着色器"
outline: deep
---

# 地球扫描

*Earth Scan*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=earthScan)


![地球扫描](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/earthScan.jpg)


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
varying vec2 vUv;
    void main(){
    vUv=uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
```

### 片元

- 片元输出 gl_FragColor

```glsl
float PI = acos(-1.0);
    uniform vec3 uColor;
    uniform vec2 pointNum;
    uniform float iTime;                        
    varying vec2 vUv;
    void main(){
    vec2 uv = vUv+ vec2(0.0, iTime);
      float current = abs(sin(uv.y * PI) );             
    if(current < 0.99) {      
      current=current*0.5;
    }
    float d = distance(fract(uv * pointNum), vec2(0.5, 0.5));
    if(d > current*0.2 ) {
       discard;
    } else {
       gl_FragColor =vec4(uColor,current);
    }
  }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 8, 8)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

const earthGeometry = new THREE.SphereGeometry(2.5, 32, 16)

const earthMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/earth1.jpg') })

const earth = new THREE.Mesh(earthGeometry, earthMaterial)

scene.add(earth)

const geometry = new THREE.SphereGeometry(3, 32, 16)

const material = new THREE.ShaderMaterial({

  uniforms: {

    iTime: { value: 0.0 },

    pointNum: { value: new THREE.Vector2(64, 32) },

    uColor: { value: new THREE.
```

