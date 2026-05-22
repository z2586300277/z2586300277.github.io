---
title: "黑洞 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,黑洞"
outline: deep
---
# 黑洞

*Black Hole*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blackhole)

![黑洞](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/blackhole.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- GUI 面板调试参数

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

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { GUI } from "dat.gui";

const canvas = document.createElement("canvas");
canvas.style.width = "100vw !important";
canvas.style.height = "100vh !important";
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 3, 10);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 25;

const material = new THREE.RawShaderMaterial({
  glslVersion: THREE.GLSL3,
  uniforms: {
    // 黑洞参数
    hole: {
      value: {
        // 位置
        pos: new THREE.Vector3(0, 0, 0),
        // 史瓦西半径，与引力强度有关
        rs: 0.05,
      },
    },
    // 相机参数
    camera: {
      value: {
        pos: new THREE.Vector3(),
        // 世界矩阵
        world: new THREE.Matrix4(),
        // 投影矩阵
        proj_inv: new THREE.Matrix4(),
      },
    },
    max_steps: { value: 1000 },
    step_size: { value: 0.03 },
    time: { value: 0.0 },
    resolution: {
      value: new THREE.Vector2(),
    },
    color: { value: new THREE.Color(0xe0eaff) },
  },

  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;
    precision highp sampler2D;

    struct Hole {
      vec3 pos;
      float rs;
    };

    struct Camera {
      vec3 pos;
      mat4 world;
      mat4 proj_inv;
    };

    uniform  Hole    hole    ;
    uniform  Camera  camera  ;

    in  vec3  position  ;
    in  vec2  uv        ;
    
    smooth  out  vec3  V_pos   ; // 片元在世界坐标系中的位置

    void main() {
      // 从投影矩阵还原光线投射平面的坐标
      // ndc
      vec4 pos_vert = vec4((uv - 0.5) * 2.0, -1.0, 1.0);  
      // view
      pos_vert = camera.proj_inv * pos_vert;  
      pos_vert /= pos_vert.w;  
      // world
      pos_vert.w = 1.0;
      pos_vert = camera.world * pos_vert;

      V_pos = pos_vert.xyz;

      gl_Position = vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;
    precision highp sampler2D;

    #define pi 3.141592653589793

    struct Hole {
      vec3 pos;
      float rs;
    };

    struct Camera {
      vec3 pos;
      mat4 world;
      mat4 proj_inv;
    };

    struct Ray {
      vec3 pos;
      vec3 dir;
      float d;
    };

    uniform  Hole       hole        ;
    uniform  Camera     camera      ;
    uniform  uint       max_steps   ;
    uniform  float      step_size   ;
    uniform  float      time        ;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blackhole) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
