---
title: "雪花 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,雪花"
outline: deep
---
# 雪花

*Snow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=snowParticle)

![雪花](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/snowParticle.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

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

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 7);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

new OrbitControls(camera, renderer.domElement);

let gu = {
  time: {value: 0}
}

class Flakes extends THREE.Points{
  constructor(gu){
    let flakeData = [];
    let g = new THREE.BufferGeometry().setFromPoints(new Array(1000).fill().map(_ => {
      flakeData.push(((Math.random() < 0.5) ? -1 : 1), 0, 0, 0);
      return new THREE.Vector3().random().subScalar(0.5).multiplyScalar(10)
    }));
    g.setAttribute("flakeData", new THREE.Float32BufferAttribute(flakeData, 4));
    let m = new THREE.PointsMaterial({
      color: 0xfbec5d,
      size: 0.75,
      onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.vertexShader = `
          uniform float time;
          attribute vec4 flakeData;
          varying vec4 vFlakeData;
          varying float vId;
          ${shader.vertexShader}
        `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          vId = float(gl_VertexID);
          vFlakeData = flakeData;

          vec3 p = vec3(position);

          transformed.y = 5. - mod(p.y + time * 0.5 - 5., 10.);

          `
        );

        shader.fragmentShader = `
          uniform float time;
          varying vec4 vFlakeData;
          varying float vId;

          // 2D Random
          float random (in vec2 st) {
              return fract(sin(dot(st.xy,
                                   vec2(12.9898,78.233)))
                           * 43758.5453123);
          }

          // 2D Noise based on Morgan McGuire @morgan3d
          // https://www.shadertoy.com/view/4dS3Wd
          float noise (in vec2 st) {
              vec2 i = floor(st);
              vec2 f = fract(st);

              // Four corners in 2D of a tile
              float a = random(i);
              float b = random(i + vec2(1.0, 0.0));
              float c = random(i + vec2(0.0, 1.0));
              float d = random(i + vec2(1.0, 1.0));

              // Smooth Interpolation

              // Cubic Hermine Curve.  Same as SmoothStep()
              vec2 u = f*f*(3.0-2.0*f);
              // u = smoothstep(0.,1.,f);

              // Mix 4 coorners percentages
              return mix(a, b, u.x) +
                      (c - a)* u.y * (1.0 - u.x) +
                      (d - b) * u.x * u.y;
          }

          mat2 rot(float a){
            float c = cos(a);
            float s = sin(a);
            return mat2(c, -s, s, c);
          }

          ${shader.fragmentShader}
        `.replace(
          `#include <clipping_planes_fragment>`,
          `#include <clipping_planes_fragment>
          vec2 baseUv = gl_PointCoord.xy - 0.5;
          vec2 uv = rot(mod(vId + (time * vFlakeData.x), PI2)) * (baseUv * 10.);
          float a = atan(uv.y, uv.x) + PI;
          float r = length(uv);
          float aStep = PI / 3.;
          float aPart = abs(mod(a, aStep) - (0.5 * aStep));
          vec2 suv = vec2(cos(aPart), sin(aPart)) * r - vec2(time, 0.);
          float n = noise(suv + vId);
          //n = pow(n, 2.);
          if (length(baseUv) > 0.5 || n < 0.5) discard;
          `
        ).replace(
          `#include <color_fragment>`,
          `#include <color_fragment>
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.875, 0, 0), smoothstep(1., 0.5, n));
          `
        );
        console.log(shader.fragmentShader);
      }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=snowParticle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
