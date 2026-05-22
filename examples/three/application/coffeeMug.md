---
title: "咖啡 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initializeScene`、`onWindowResize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,咖啡"
outline: deep
---

# 咖啡

*Coffee Mug*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=coffeeMug)


![咖啡](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/coffeeMug.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initializeScene`、`onWindowResize`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
#define M_PI 3.1415926535897932384626433832795

        varying vec2 vUv;
        
        uniform float uTime;
        uniform sampler2D uPerlinTexture;
        
        vec2 rotate2D(vec2 value, float angle)
        {
        float s = sin(angle);
        float c = cos(angle);
        mat2 m = mat2(c, s, -s, c);
        return m * value;
        }

        
        void main()
        {
          vUv = uv;
        
          vec3 newPosition = position;
          float angle = texture(
            uPerlinTexture,
            vec2(0.5, uv.y * 0.3 + uTime * 0.02
       
```

### 片元

- `time` uniform 驱动动画

```glsl
varying vec2 vUv;

        uniform float uTime;
        uniform sampler2D uPerlinTexture;
        
        void main()
        {
        
          vec2 uv = vec2(vUv.x * 0.5, vUv.y * 0.3 - uTime / 15.);
        
          float intensity = texture2D(uPerlinTexture, uv).x;
          intensity = smoothstep(0.4, 1.0, intensity);
          
          intensity *= smoothstep(0.0, 0.1, vUv.x);
          intensity *= smoothstep(1.0, 0.9, vUv.x);
        
          intensity *= smoothstep(0.0, 0.1, vUv.y);
          intensity *= smoothstep(1.0, 0.4, vUv.y);
        
        
     
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'dat.gui'

const initializeScene = ({ root, antialias = true } = {}) => {
    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.z = 110;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    root.appendChild(renderer.domElement);

    const onWindowResize = () => {
        // Adjust camera and renderer on window resize
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        controls.update();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    };
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

```

