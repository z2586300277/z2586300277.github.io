---
title: "花 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createWorld`、`onWindowResize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,花,着色器"
outline: deep
---

# 花

*Flower Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowerShader)


![花](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/flowerShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createWorld`、`onWindowResize`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 着色器

### 顶点

```glsl
vec3 mod289(vec3 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 mod289(vec4 x)
    {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
  
    vec4 permute(vec4 x)
    {
      return mod289(((x*34.0)+1.0)*x);
    }
  
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
  
    vec3 fade(vec3 t) {
      return t*t*t*(t*(t*6.0-15.0)+10.0);
    }
  
    // Classic Perlin noise
    float cnoise(vec3 P)
    {
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3
```

### 片元

- 片元输出 gl_FragColor
- `time` uniform 驱动动画

```glsl
varying float qnoise;
  
    uniform float time;
    uniform bool redhell;
    uniform float r_color;
    uniform float g_color;
    uniform float b_color;
  
    void main() {
      float r, g, b;
  
      r = cos(qnoise + (r_color));
      g = cos(qnoise + g_color);
      b = cos(qnoise + (b_color));
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
```

## 源码

```js
import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";

var scene, camera, renderer;
var _width, _height;
var mat;

function createWorld() {
  _width = window.innerWidth;
  _height= window.innerHeight;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 5, 15);
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,0,10);
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  _width = window.innerWidth;
  _height = window.innerHeight;
  renderer.setSize(_width, _height);
  camera.aspect = _width / _height;
  camera.updateProjectionMatrix();
  console.log('- resize -');
}

var _ambientLights, _lights;
function createLights() {
  _ambientLights = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1.4);
  _lights = new THREE.PointLight(0xFFFFFF, .5);
  _lights.position.set(20,20,20);
  scene.add(_ambientLights);
}

var uniforms = {
  time: {
    type: "f",
    value: 1.0
  },
  pointscale: {
    type: "f",
    value: 1.0
  },
  decay: {
    type: "f",
    value: 2.0
  },
  comp
```

