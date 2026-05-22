---
title: "水天一色 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,水天一色"
outline: deep
---

# 水天一色

*Water Sky*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waterSky)


![水天一色](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/waterSky.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `render`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `render()` — renderer.render(scene, camera)

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
void main() {
        gl_Position = vec4( position, 1.0 );
    }
```

### 片元

- `time` uniform 驱动动画

```glsl
uniform vec2 Mouse;
    uniform vec2 Resolution;
    uniform float Time;

    const float DRAG_MULT = 0.048;
    const int ITERATIONS_RAYMARCH = 13;
    const int ITERATIONS_NORMAL = 48;


    vec2 wavedx(vec2 position, vec2 direction, float speed, float frequency, float timeshift) {
        float x = dot(direction, position) * frequency + timeshift * speed;
        float wave = exp(sin(x) - 1.0);
        float dx = wave * cos(x);
        return vec2(wave, -dx);
    }

    float getwaves(vec2 position, int iterations){
        float iter = 0.0;
        float phase = 6.0;
   
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50,DOM.clientWidth / DOM.clientHeight, 0.1, 100000)
camera.position.set(10,10,10)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true, logarithmicDepthBuffer: true  })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
renderer.setPixelRatio( window.devicePixelRatio * 2)
renderer.setClearColor( 0x000000 )
DOM.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const uniforms = {
    Mouse: {
        type: 'v2',
        value: new THREE.Vector2(0, 0)
    },
    Resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    Time: {
        type: 'f',
        value: 1.0
    }
}
DOM.addEventListener('mousemove',(event) => uniforms.Mouse.value = new THREE.Vector2(
    (event.offsetX / event.target.clientWidth) * 2 - 1,
    -(event.offsetY /  event.target.clientHeight) * 2 + 1
))
const geometry = new THREE.PlaneGeometry( 10, 10 );

var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: `
    void main() {
        gl_Position = vec4( position, 1.0 );
    }
    `,

```

