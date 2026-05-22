---
title: "圆波扫光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,圆波扫光,着色器"
outline: deep
---

# 圆波扫光

*Circle Wave*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=circleWave)


![圆波扫光](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/circleWave.jpg)


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
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
```

### 片元

- `time` uniform 驱动动画

```glsl
#define uScanOrigin vec3(0.0, 0.0, 0.0)
        #define uScanWaveRatio1 3.2
        #define uScanWaveRatio2 2.8

        uniform float uTime;
        uniform sampler2D uScanTex;
        uniform vec3 uScanColor;
        uniform vec3 uScanColorDark;
        
        varying vec2 vUv;
        varying vec3 vPosition;

        float circleWave(vec3 p, vec3 origin, float distRatio) {
            float t = uTime;
            float dist = distance(p, origin) * distRatio;
            float radialMove = fract(dist - t);
            float fadeOutMask = 1.0 - smoothstep(1.0, 3.0, dist);
 
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 1, 0)

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

// 创建平面几何体
const geometry = new THREE.PlaneGeometry(2, 2);

const texture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/wave.png') 
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping

// 创建材质
const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending, // 添加混合模式让效果更亮
    uniforms: {
        uTime: { value: 0.0 },
        uScanTex: { value:texture },
        uScanColor: { value: new THREE.Color(0x00ffff) },    // 主要扫描颜色
        uS
```

