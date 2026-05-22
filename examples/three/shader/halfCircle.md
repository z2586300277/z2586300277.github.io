---
title: "半圆 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,半圆"
outline: deep
---
# 半圆

*Half Circle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=halfCircle)

![半圆](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/halfCircle.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- Stats 性能监视

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createRayMarchingFireMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

var scene, camera, renderer, clock, controller, stats
var shader_material, rayMarchingFireMaterial, shaderMaterial
const vs = `
varying vec2 vUv;
varying vec3 vPosition;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vPosition=position;
}
`;

const fs = `
      #define PI 3.1415926535897932384626433832795
      varying vec2 vUv;

      uniform float uTime;

      vec2 rotatePoint(vec2 center,float angle,vec2 p) {
        float s = sin(angle);
        float c = cos(angle);

        // translate point back to origin:
        p.x -= center.x;
        p.y -= center.y;

        // rotate point
        float xNew = p.x * c - p.y * s;
        float yNew = p.x * s + p.y * c;

        // translate point back:
        p.x = xNew + center.x;
        p.y = yNew + center.y;
        return p;
      }

      float angleVec(vec2 a_, vec2 b_) {
          vec3 a = vec3(a_, 0);
          vec3 b = vec3(b_, 0);
          float dotProd = dot(a,b); 
          vec3 crossprod = cross(a,b);
          float crossprod_l = length(crossprod);
          float lenProd = length(a)*length(b);
          float cosa = dotProd/lenProd;
          float sina = crossprod_l/lenProd;
          float angle = atan(sina, cosa);
          
          if(dot(vec3(0,0,1), crossprod) < 0.0) 
              angle=90.0;
          return (angle * (180.0 / PI));
      }

      void main(){
        vec2 center = vec2(0.5, 0.5);
        float angleStela = 180.0;
        float radius = 0.5;
        float startAlpha = 0.0;
        float endAlpha = 0.5;
        vec3 color = vec3(0.0, 1.0, 0.0);
        float alpha = 0.0;
        
        float angle = (-uTime * 2.0);

        vec2 lineEnd =  vec2(center.x, center.y + radius);
        float distanceToCenter = distance(center, vUv.xy);	
        lineEnd = rotatePoint(center, angle, lineEnd);
        float angleStelaToApply = angleVec(normalize(lineEnd - center), normalize(vUv - center));
        if (angleStelaToApply < angleStela && distanceToCenter < radius) {
          float factorAngle = 1.0 - angleStelaToApply/angleStela;
          float finalFactorAngle = factorAngle * endAlpha;
          if (finalFactorAngle > startAlpha) {
            alpha = finalFactorAngle;
          }
        }

        gl_FragColor=vec4(color, alpha);
      }
      `

init();
animate();

// - Functions -
function init() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 10, 10)
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 开启抗锯齿处理
    alpha: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio)

  createRayMarchingFireMaterial();

  var axisHelper = new THREE.AxesHelper(10);
  scene.add(axisHelper);

  stats = new Stats()
  document.body.appendChild(stats.dom);

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=halfCircle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
