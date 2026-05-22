---
title: "地球粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,地球粒子,粒子"
outline: deep
---

# 地球粒子

*Globe Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=globeParticle)


![地球粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/globeParticle.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 后期：`EffectComposer` 串 Pass，先 `RenderPass` 出场景，再 bloom/SSAO 等屏幕 Pass。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
attribute float size;
    uniform float time;
    uniform float pixelRatio;
    varying vec3 vColor;
    void main() {
      vColor = color;
      float pulse = 1.0 + 0.2 * sin(time + position.x + position.z);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * pulse * pixelRatio * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying vec3 vColor;
    void main() {
      float distanceToCenter = length(gl_PointCoord - vec2(0.5));
      if (distanceToCenter > 0.5) discard;
      float alpha = 1.0 - smoothstep(0.4, 0.5, distanceToCenter);
      gl_FragColor = vec4(vColor, alpha);
    }
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020209);
scene.fog = new THREE.Fog(0x020209, 15, 60);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.getElementById("box").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x333366, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffcc, 1.2);
directionalLight.position.set(1, 3, 2);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x3366ff, 2, 10);
pointLight.position
```

