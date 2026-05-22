---
title: "粒子地球 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子地球"
outline: deep
---
# 粒子地球

*Points Earth*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=pointsEarth)

![粒子地球](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/pointsEarth.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let gui = new GUI();
// 初始化场景、相机和渲染器
const gl = {
    clearColor: '#332148',
    shadows: false,
    alpha: false,
    outputColorSpace: THREE.SRGBColorSpace,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

const renderer = new THREE.WebGLRenderer({ alpha: gl.alpha });
renderer.setClearColor(gl.clearColor);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
// 设置相机位置
camera.position.z = 2;
// Shaders
const vertexShader = `  uniform float size;
uniform sampler2D elevTexture;
uniform sampler2D alphaTexture;
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveSpeed;

varying vec2 vUv;
varying float vVisible;
varying float vAlpha;
varying float vElevation;
// Function to generate fBm with vec3 input
float random(vec3 st) {
return fract(sin(dot(st.xyz, vec3(12.9898,78.233,45.164))) * 43758.5453123);
}

float noise(vec3 st) {
vec3 i = floor(st);
vec3 f = fract(st);

// Eight corners in 3D of a tile
float a = random(i);
float b = random(i + vec3(1.0, 0.0, 0.0));
float c = random(i + vec3(0.0, 1.0, 0.0));
float d = random(i + vec3(1.0, 1.0, 0.0));
float e = random(i + vec3(0.0, 0.0, 1.0));
float f1 = random(i + vec3(1.0, 0.0, 1.0));
float g = random(i + vec3(0.0, 1.0, 1.0));
float h = random(i + vec3(1.0, 1.0, 1.0));

vec3 u = f * f * (3.0 - 2.0 * f);

return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
       mix(mix(e, f1, u.x), mix(g, h, u.x), u.y), u.z);
}

float fbm(vec3 st) {
float value = 0.0;
float amplitude = 0.5;

for (int i = 0; i < 5; i++) {
value += amplitude * noise(st);
st *= 2.0;
amplitude *= 0.5;
}
return value;
}

void main() {
vUv = uv;
float alphaLand = 1.0 - texture2D(alphaTexture, vUv).r;
vAlpha = alphaLand;
vec3 newPosition = position;

if(alphaLand < 0.5) {
// Sea
// fBm for wave-like displacement
float waveHeight = uWaveHeight; // Adjust wave height as needed
float waveSpeed = uWaveSpeed;  // Adjust wave speed as needed
float displacement = (fbm(newPosition * 5.0 + uTime * waveSpeed) * 2.0 - 1.0) * waveHeight;
vElevation = displacement;
newPosition += normal * displacement ;
}

vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
float elv = texture2D(elevTexture, vUv).r;
vec3 vNormal = normalMatrix * normal;
vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
mvPosition.z += 0.45 * elv;

// 求出 mvPosition 距离相机的距离
float dist = length(mvPosition.xyz);
// 根据距离调整 size
float pointSize = size * (1.0 - dist / 10.0);
gl_PointSize = max(pointSize, 1.0);
gl_PointSize = pointSize;
gl_Position = projectionMatrix * mvPosition;
}
`; // 将pointsEarth.vert的内容粘贴在这里
const fragmentShader = `  uniform sampler2D colorTexture;
// uniform sampler2D alphaTexture;
uniform sampler2D earthTexture;
uniform sampler2D starTexture;

varying vec2 vUv;
varying float vVisible;
varying float vAlpha;
varying float vElevation;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=pointsEarth) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
