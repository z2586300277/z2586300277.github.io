---
title: "天空云 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createRandom`、`resize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,天空云,着色器"
outline: deep
---

# 天空云

*Cloud Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cloudShader)


![天空云](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cloudShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createRandom`、`resize`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 大量重复物体用 `InstancedMesh`，一次 draw call；矩阵写 `setMatrixAt`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化

## 源码

```js
import {
    CanvasTexture,
    TextureLoader,
    PlaneGeometry,
    ShaderMaterial,
    InstancedMesh,
    Object3D,
    Vector2,
    InstancedBufferAttribute,
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,
    Scene,
    Color
} from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "dat.gui";

function createRandom(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}
function resize(render, cameras, callback) {
    cameras = Array.isArray(cameras) ? cameras : [cameras];
    window.addEventListener("resize", () => {
        const [w, h] = [window.innerWidth, window.innerHeight];
        render.setSize(window.innerWidth, window.innerHeight);
        cameras.forEach((camera) => {
            if (camera.type === "OrthographicCamera") {
                camera.top = 15 * (h / w);
                camera.bottom = -15 * (h / w);
            } else if (camera.type === "PerspectiveCamera") {
                camera.aspect = window.innerWidth / window.innerHeight;
            }
            camera.updateProjectionMatrix();
        });
        callback && callback(w, h);
    });
}
function initStats(showPanel = 0) {
    const stats = new Stats();
    stats.showPanel(showPanel);
    const dom = document.querySelector("#box");
    dom.appendChild(stats.dom);
    return stats;

```

### glsl

```js
`
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
  `;

const fs =
```

### glsl

```js
`
  varying vec2 vUv;
  uniform sampler2D map;
  uniform float fogNear;
  uniform float fogFar;
  uniform vec3 fogColor;
  uniform int enableFog; // 0: false, 1: true
  
  void main(){
    if(enableFog == 1){
      // 计算片源深度 
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      // 计算归一化的深度
      float fogFactor = smoothstep(fogNear, fogFar, depth);
      // 计算雾透明度
      gl_FragColor.w *= pow(gl_FragCoord.z, 20.0);
      // 最终结果
      gl_FragColor = mix(texture2D(map, vUv), vec4(fogColor, gl_FragColor.w), fogFactor);
    }else{
      gl_FragColor = texture2D(map, vUv);
    }
  }
  `

async function init() {
    const dummy = new Object3D();
    const mouse = new Vector2();
    const halfSize = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const startTime = Date.now();
    const params = {
        count: 800,
        enableFog: true,
        fogColor: '#4584b4',
        fogNear: -100,
        fogFar: 3000,
    };

    const renderer = initRenderer();
    const camera = new PerspectiveCamera(30, halfSize.x / halfSize.y, 1, params.count * 1.5);
    window.camera = camera;

    const status = initStats();
    const scene = initScene();

    // background
    const backgroundCanvas = document.createElement("canvas");
    const ctx = backgroundCanvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0,
```

