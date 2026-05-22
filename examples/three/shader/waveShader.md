---
title: "图像波动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `ThreeCore`。"
head:
  - - meta
    - name: keywords
      content: "three.js,图像波动"
outline: deep
---

# 图像波动

*Wave Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waveShader)


![图像波动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/waveShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `ThreeCore`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 类与方法

### ThreeCore

- `constructor()` — 参数：dom, options
- `onRenderer()` — 移除 Entity / 解绑监听
- `onDestroy()` — 移除 Entity / 解绑监听
- `animate()` — 移除 Entity / 解绑监听
- `addAnimate()` — 移除 Entity / 解绑监听
- `removeAnimate()`
- `destroyed()` — 移除 Entity / 解绑监听

### ThreeProject

- `constructor()` — 参数：dom
- `init()` — 材质 / GLSL
- `onRenderer()` — 材质 / GLSL

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
precision mediump float;
                    uniform float uTime;
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                        modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05;
                        modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;
                        gl_Position = projectionMatrix * viewMatrix * modelPosition;
                    }
```

### 片元

- 片元输出 gl_FragColor

```glsl
precision mediump float;
                    uniform sampler2D uTexture;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 textureColor = texture2D(uTexture, vUv);
                        gl_FragColor = textureColor;
                    }
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

class ThreeCore {
    dom;
    scene;
    camera;
    defaultCamera;
    renderer;
    clock;
    options;
    stats;
    // 要执行动画的对象集合, 子类可以把自己的动画写进 onRender 也可以 this.addAnimate() 添加到父类动画集合里
    animates;
    constructor(dom, options) {
        this.dom = dom;
        this.options = options;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.animates = {};
        const k = dom.clientWidth / dom.clientHeight;
        if ("fov" in options.cameraOptions) {
            this.defaultCamera = new THREE.PerspectiveCamera(options.cameraOptions.fov, k, options.cameraOptions.near, options.cameraOptions.far);
        }
        else {
            const s = options.cameraOptions.s;
            this.defaultCamera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, options.cameraOptions.near, options.cameraOptions.far);
        }
        this.camera = this.defaultCamera;
        this.scene.add(this.camera);
        const rendererOptions = {
            // 抗锯齿
            antialias: true,
            alpha: true,
            // 深度缓冲, 解决模型重叠部分不停闪烁问题
            // 这个属性会导致精灵材质会被后面的物体遮挡
            // 只能出现问题的时候, 在那个场景 new ThreeCore继承类的时候, 传入rendere
```

