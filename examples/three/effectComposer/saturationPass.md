---
title: "饱和度(自定义Pass) - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`initComposer`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,饱和度(自定义Pass),后期处理"
outline: deep
---

# 饱和度(自定义Pass)

*Saturation*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=saturationPass)


![饱和度(自定义Pass)](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/saturationPass.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`initComposer`。

> 后期处理 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `initComposer()` — 材质 / GLSL
- `addMesh()` — 材质 / GLSL
- `render()` — renderer.render(scene, camera)

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
```

### 片元

```glsl
vec3 hsv2rgb( in vec3 c ){
                vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

                return c.z * mix( vec3(1.0), rgb, c.y);
            }

            vec3 rgbToHsv(vec3 rgb){
                vec3 hsv = vec3(0);
                float maxC = max(max(rgb.r,rgb.g),rgb.b);
                float minC = min(min(rgb.r,rgb.g),rgb.b);
                float delta = maxC - minC;
                if (maxC == rgb.r) hsv.x = mod((rgb.g - rgb.b)/delta,6.0)/6.0;
                if (maxC == rgb.g) hsv.x = (rgb.b - rgb.r)/(delta*6.0) + 1.0/3.0;

```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

window.addEventListener('load', e => {
    init();
    initComposer();
    addMesh();
    render();
})

let scene, renderer, camera, orbit;
let composer;

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.add(new THREE.PointLight(0xffffff, 1, 1000, 0.01));
    camera.position.set(10, 10, 10);
    scene.add(camera);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    scene.add(new THREE.GridHelper(10, 10));
}

function initComposer() {
    composer = new EffectComposer(renderer);
    let renderPass = new RenderPass(sc
```

