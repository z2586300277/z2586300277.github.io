---
title: "代码云 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`initMaterial`。"
head:
  - - meta
    - name: keywords
      content: "three.js,代码云"
outline: deep
---

# 代码云

*Code Cloud*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=codeCloud)


![代码云](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/codeCloud.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`initMaterial`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `initMaterial()` — 材质 / GLSL
- `animate()` — rAF：update controls + render
- `snowanimate()` — 材质 / GLSL

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

```glsl
varying vec2 vUv;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;
uniform sampler2D texture6;
uniform sampler2D texture7;
uniform sampler2D texture8;
uniform sampler2D texture9;

uniform float random;
void main() {

  //if(vUv.y > 0.5) {
  //  gl_FragColor = texture2D( texture0, vec2(fract(vUv.y * 2.0), vUv.x));
  //}else {
  //  gl_FragColor = texture2D( texture1, vec2(fract(vUv.y * 2.0), vUv.x));
  //}
  
  float selfRandom = vUv.y - fract(vUv.y);
  float k = abs(sin(selfRandom * 
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

var scene, camera, renderer, clock, controller, stats
var shader_material, cloud, range = 50

init();
animate();

// - Functions -
function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(10, 10, 10)
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿处理
        alpha: true,
    });
    renderer.setClearColor(0x000000)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)

    var axisHelper = new THREE.AxesHelper(10);
    scene.add(axisHelper);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(400, 200, 300);
    // directionalLight.castShadow = true
    scene.add(directionalLight);
    // 方向光2
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight2.position.set(-400, -200, -300);
    scene.add(directionalLight2);
    //环境光
    var ambient = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambient);

    stats = n
```

