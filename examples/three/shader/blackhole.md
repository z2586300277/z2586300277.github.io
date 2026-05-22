---
title: "黑洞 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`、`render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,黑洞,着色器"
outline: deep
---

# 黑洞

*Black Hole*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=blackhole)


![黑洞](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/blackhole.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`、`render`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 独立函数

- `render()` — renderer.render(scene, camera)

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

  vertexShader:
```

### glsl

```js
`
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

  fragmentShader:
```

### glsl

```js
`
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
    uniform  vec2       resolution  ;
    uniform  vec3       color       ;

    smooth  in  vec3  V_pos  ;

    layout(location = 0) out vec4 c_out;

    // 引力加速度
    vec3 a(in Ray ray) {
      vec3 dir = normalize(hole.pos - ray.pos);
      float strength = hole.rs / (ray.d * ray.d) * 0.4 + abs(dot(ray.dir, dir)) * 0.001;
      return dir * strength;
    }

    float CubicInterpolate(float x) {
      return 3.0 * pow(x, 2.0) - 2.0 * pow(x, 3.0);
    }
    
    float PerlinNoise(vec3 Position) {
      vec3 PosInt = floor(Position);
      vec3 PosFloat = fract(Position);
    
      float Sx = CubicInterpolate(PosFloat.x);
      float Sy = CubicInterpolate(PosFloat.y);
      float Sz = CubicInterpolate(PosFloat.z);
    
      float v000 = 2.0 * fract(sin(dot(vec3(PosInt.x, PosInt.y, PosInt.z), vec3(12.9898, 78.2
```

