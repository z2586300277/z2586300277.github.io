---
title: "全息投影 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,全息投影,着色器"
outline: deep
---

# 全息投影

*Hologram*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=hologram)


![全息投影](https://coderfmc.github.io/three.js-demo/全息投影.png)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 源码

```js
/**
 * 全息投影
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const vertexShader=`
#include <common>
precision mediump float;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(){
    /**
    * Position
    */
    vec4 modelPosition=modelMatrix*vec4(position,1.);

    // 实现
    float gltichTime = modelPosition.y-uTime;
    // 正弦波的叠加，非规律
    float gltichStrength=sin(gltichTime)+sin(gltichTime*3.45)-sin(gltichTime*8.5);
    gltichTime=gltichTime/3.0;
    // 平滑step
    gltichStrength=smoothstep(0.3,1.0 ,gltichStrength );
    // 随着时间变化的随机数种子，生成随机偏移量。 
    modelPosition.x+=(random(modelPosition.xz+uTime)-0.5)*gltichStrength*0.25;
    modelPosition.z+=(random(modelPosition.zx+uTime)-0.5)*gltichStrength*0.25;

       // 计算法线变换矩阵：逆矩阵并转置
     mat3 normalMatrix = transpose(inverse(mat3(modelMatrix)));
    // 使用法线变换矩阵变换法线
    vec3 transformedN
```

