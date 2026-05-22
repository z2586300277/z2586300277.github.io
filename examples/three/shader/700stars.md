---
title: "1000stars留念 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。一个专注于前端可视化的开源组织，三维可视化开发者抱团取暖，开源分享知识，接活盈利，让自己更有底气，加入请联系。主流程在 `init_scene`、`load_terrain`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,1000stars留念,着色器"
outline: deep
---

# 1000stars留念

*1000stars*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=700stars)


![1000stars留念](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/700stars.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。一个专注于前端可视化的开源组织，三维可视化开发者抱团取暖，开源分享知识，接活盈利，让自己更有底气，加入请联系。主流程在 `init_scene`、`load_terrain`。

> 着色器 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from "three";
import { ImprovedNoise } from 'three/examples/jsm/Addons.js';
// 700stars留念 共筑 共享
import {  DirectionalLight, AmbientLight, Mesh, PlaneGeometry, MeshLambertMaterial, Vector2,Color } from 'three';
let fbm = `
    // https://github.com/yiwenl/glsl-fbm/blob/master/3d.glsl
    #define NUM_OCTAVES 6

    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

    float noise(vec3 p){
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);

        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);

        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);

        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));

        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

        return o4.y * d.y + o4.x * (1.0 - d.y);
    }

    float fbm(vec3 x) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100);
      for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
```

