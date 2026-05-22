---
title: "白云 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,白云"
outline: deep
---

# 白云

*White Cloud*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=whiteCloud)


![白云](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/whiteCloud.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### Base

- `constructor()` — 初始化成员
- `main()`
- `init()`

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { innerWidth, innerHeight } = window;
const aspect = innerWidth / innerHeight;

class Base {
    constructor () {
        this.init();
        this.main();
    }
    main() {
        this.deltaTime = {
            value: 0
        }

        var fragmentSrc = [
            "precision mediump float;",

            "uniform vec2 iResolution;",
            "uniform float iGlobalTime;",
            "uniform vec2 iMouse;",

            "float hash( float n ) {",
            "return fract(sin(n)*43758.5453);",
            "}",

            "float noise( in vec3 x ) {",
            "vec3 p = floor(x);",
            "vec3 f = fract(x);",
            "f = f*f*(3.0-2.0*f);",
            "float n = p.x + p.y*57.0 + 113.0*p.z;",
            "return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),",
            "mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),",
            "mix(mix( hash(n+113.0), hash(n+114.0),f.x),",
            "mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);",
            "}",

            "vec4 map( in vec3 p ) {",
            "float d = 0.2 - p.y;",
            "vec3 q = p - vec3(1.0,0.1,0.0)*iGlobalTime;",
            "float f;",
            "f  = 0.5000
```

