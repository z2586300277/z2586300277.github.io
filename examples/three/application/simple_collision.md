---
title: "简单碰撞检测 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `reset`、`update_player`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,简单碰撞检测,应用场景"
outline: deep
---

# 简单碰撞检测

*Simple Coll*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=simple_collision)


![简单碰撞检测](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/simple_coll.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `reset`、`update_player`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 源码

```js
import { Scene, Fog, Color, PerspectiveCamera, WebGLRenderer, DirectionalLight, AmbientLight, PlaneGeometry, MeshLambertMaterial, Mesh, GridHelper, Vector2, Line3, MeshStandardMaterial, Vector3, Box3, Matrix4, Clock, CapsuleGeometry, Box3Helper, } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
let scene, terrain, camera, controls, clock, renderer;
// 碰撞参数/三维世界参数
const params = {
    firstPerson: false,
    displayCollider: false,
    displayBVH: false,
    visualizeDepth: 10,
    gravity: -30,
    playerSpeed: 10,
    // 步长
    physicsSteps: 5,
};
// 分数布朗运动 用于生成随机地形
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

        vec4 o3 = o2 * d.z + o1 
```

