---
title: "天空云 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,天空云"
outline: deep
---
# 天空云

*Cloud Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cloudShader)

![天空云](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cloudShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 实时阴影 ShadowMap
- 天空盒与环境贴图
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createRandom()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`resize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initStats()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initRenderer()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initGUI()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initScene()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
}
function initRenderer(props = {}) {
    const dom = document.getElementById("box");
    dom.style.width = "100vw";
    dom.style.height = "100vh";

    const renderer = new WebGLRenderer({ antialias: true, ...props });
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.setPixelRatio(devicePixelRatio);

    renderer.setClearColor(new Color(0xffffff));
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);

    dom.appendChild(renderer.domElement);
    window.renderer = renderer;

    return renderer;
}
function initGUI(params) {
    return new GUI(params);
}
function initScene() {
    const scene = new Scene();
    window.scene = scene;
    return scene;
}
window.onload = () => {
    init();
};

const vs = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
  `;

const fs = /* glsl */ `
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
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cloudShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
