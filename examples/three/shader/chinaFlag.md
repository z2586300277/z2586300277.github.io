---
title: "中国旗帜 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,中国旗帜,着色器"
outline: deep
---

# 中国旗帜

*China Flag*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=chinaFlag)


![中国旗帜](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/chinaFlag.jpg)


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
uniform mat4 projectionMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform vec2 uFrequency;
        uniform float uTime;
        uniform float uStrength;
        attribute vec3 position;
        attribute vec2 uv;
        varying float vDark;
        varying vec2 vUv;
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float xFactor = clamp((modelPosition.x + 1.25) / 2.0, 0.0, 2.0); 
            float vWave = sin(modelPosition.x * uFrequency.x - uTime ) * xFactor * uStrength ;
            vWa
```

### 片元

- 片元输出 gl_FragColor

```glsl
precision mediump float;
        varying float vDark;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main(){
            vec4 textColor = texture2D(uTexture, vUv);
            textColor.rgb *= vDark + 0.85;
            gl_FragColor = textColor;
        }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0.5, -0.5, 3)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const flagTexture = new THREE.TextureLoader().load(GLOBAL_CONFIG.getFileUrl("images/chinaFlag.jpg"))

const flagMaterial = new THREE.RawShaderMaterial({

    vertexShader: `uniform mat4 projectionMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform vec2 uFrequency;
        uniform float uTime;
        uniform float uStrength;
        attribute vec3 position;
        attribute vec2 uv;
        varying float vDark;
        varying vec2 vUv;
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float xFactor = clamp((modelPosition.x + 1.25) / 2.0, 0.0, 2.0); 
            float vWave = 
```

