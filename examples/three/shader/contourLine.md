---
title: "等高线 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `PerlinNoise`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,等高线,着色器"
outline: deep
---

# 等高线

*Contour Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contourLine)


![等高线](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/contourLine.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `PerlinNoise`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 类与方法

### PerlinNoise


## 独立函数

- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

const canvas = document.createElement("canvas");
canvas.style.width = "100vw !important";
canvas.style.height = "100vh !important";
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0x161616, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 26, 40);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.maxDistance = 25;

class PerlinNoise {
  static noise(x, y) {
    const posIntX = Math.floor(x);
    const posIntY = Math.floor(y);
    const posFloatX = x - posIntX;
    const posFloatY = y - posIntY;

    const sx = PerlinNoise.cubicInterpolate(posFloatX);
    const sy = PerlinNoise.cubicInterpolate(posFloatY);

    const v00 = PerlinNoise.hash(posIntX, posIntY);
    const v10 = PerlinNoise.hash(posIntX + 1, posIntY);
    const v01 = PerlinNoise.hash(posIntX, posIntY + 1);
    const v11 = PerlinNoise.hash(posIntX + 1, posIntY + 1);

    const v0 = PerlinNoise.mix(v00, v10, sx);
    const v1 = PerlinNoise.mix(v01, v11, sx);
    return PerlinNoise.mix(v0, v1, sy);
  }

  static mix(a, b
```

### glsl

```js
`
    uniform  float  range  ;

    varying  vec3  vPos     ;
    varying  vec3  vNormal  ;

    void main() {
      vec3 pos = position;

      vPos = pos;
      vNormal = normalize(normal);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader:
```

### glsl

```js
`
    uniform  float  range  ;
    uniform  float  lw     ;
    uniform  float  ln     ;
    uniform  vec3   c_bg   ;
    uniform  vec3   c_l_0  ;
    uniform  vec3   c_l_1  ;
    uniform  float  t      ;

    varying  vec3  vPos     ;
    varying  vec3  vNormal  ;

    void main() {
      vec4 c_out = vec4(c_bg, 1.0);

      // 使用法线校正等高线绘制的范围，保证宽度一致
      float a = length(vNormal / vNormal.y);
      float c = a / sqrt(a * a - 1.0);
      float clw = lw / c;

      // 取高度值，并应用时间轴动画
      float h = vPos.y - t * 0.5;

      // 在范围 (Z + clw, Z + 1.0) 的范围内绘制
      if(fract(h) > 1.0 - clw){
        float d = abs(fract(h) - 1.0 + clw * 0.5) / clw;
        float v = 1.0 - pow(d, 1.6);
        c_out.rgb = mix(c_bg, mix(c_l_0, c_l_1, vPos.y / range), v);
      }

      gl_FragColor = c_out;
    }
  `,
});

const ground = new THREE.Mesh(ground_geo, ground_mat);
scene.add(ground);

const timer = new THREE.Timer();

const tick = (delta, elapsed) => {
  controls.update(delta);
  ground_mat.uniforms.t.value = elapsed;
};

const render = () => {
  renderer.render(scene, camera);
};

const ani = () => {
  const elapsed = timer.getElapsed();
  const delta = timer.getDelta();

  timer.update();

  tick(delta, elapsed);
  render();

  requestAnimationFrame(ani);
};

const data = {
  get range() {
    return ground_mat.uniforms.range.v
```

