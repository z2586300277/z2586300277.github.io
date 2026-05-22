---
title: "溶解动画 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,溶解动画"
outline: deep
---

# 溶解动画

*Dissolve*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=dissolveAnimate)


![溶解动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/dissolveAnimate.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`animate`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `animate()` — rAF：update controls + render
- `updateMaterial()` — 材质 / GLSL

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
  varying vec3 worldPos;
  void main() {
      vUv = uv;
      worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
```

### 片元

- `time` uniform 驱动动画

```glsl
varying vec2 vUv;
 
  uniform sampler2D dissolveMap;
  uniform sampler2D texture2;
  uniform float time;
  varying vec3 worldPos;
  uniform bool flag;
  void main() {
    
    float bottom = -2.0;
    float top = 2.0;
    float yScale = (worldPos.y - bottom)/(top - bottom);
 
    vec4 color = texture2D( texture2, vUv);
    //vec4 color = vec4(1.0, 0.0, 0.0, 0.3);
    
    //float t = 1. - fract(time);
    float t;
    if(flag) {
      t = fract(time);
    }else {
      t = 1. - fract(time);
    }
    
    float h = texture2D( dissolveMap, vUv).r;

    float dissolveWi
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

var scene, camera, renderer, clock, controller, stats
var dissolveMaterials = []

init();
animate();

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(15, 5, 15)
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿处理
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)

    let shader_material = new THREE.ShaderMaterial({
        uniforms: {
            dissolveMap: {
                value: new THREE.TextureLoader().load(FILE_HOST + "threeExamples/shader/tex2.png")
            },
            texture2: {
                value: new THREE.TextureLoader().load(FILE_HOST + "threeExamples/shader/earth1.jpg")
            },
            color: {
                value: new THREE.Color(1, 0, 0)
            },
            time: {
                value: 0
            },
            flag: {
                value: true
            }
        },
        vertexShader: `    varying vec2 vUv
```

