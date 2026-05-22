---
title: "道路流光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,道路流光,应用场景"
outline: deep
---

# 道路流光

*Road Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=roadShader)


![道路流光](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/roadShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### Base

- `initThree()`
- `animate()`
- `onResize()`

### Road

- `constructor()` — 初始化成员
- `animate()` — 材质 / GLSL
- `initBloom()`
- `createChart()`

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
float PI = acos(-1.0);
        uniform vec2 uOffset;
        ${vertexMoveHeight}
        void main(void) {
          float m = getMove(uv.y, uOffset.x);
          float h = getHeight(uv.y, uOffset.y);
          vec3 newPosition = position;
          newPosition.x += m;
          newPosition.z += h;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform vec3 uColor;
        void main() {
          gl_FragColor = vec4(uColor, 0.6);
        }
```

## 源码

```js
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Base {
    initThree(el) {
        this.container = el;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.offsetWidth / this.container.offsetHeight,
            1,
            2000
        );
        this.camera.position.set(0, 10, 50);
        new OrbitControls(this.camera, this.renderer.domElement);
        this.animate();
        window.addEventListener('resize', this.onResize.bind(this));
    }
    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }
    onResize() {
        if (this.container) {
            this.camera.aspect = this.container.offsetWidth
```

