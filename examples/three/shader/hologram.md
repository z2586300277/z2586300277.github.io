---
title: "全息投影 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,全息投影"
outline: deep
---
# 全息投影

*Hologram*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=hologram)

![全息投影](https://coderfmc.github.io/three.js-demo/全息投影.png)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

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
    vec3 transformedNormal = normalize(normalMatrix * normal);
    // vec3 transformedNormal = normal;

    
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;

    vPosition=modelPosition.xyz;
    vNormal=transformedNormal;
    
}
`
const fragmentShader=`

precision mediump float;
varying vec2 vUv;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;

void main(){
  float stripes=vPosition.y-uTime*0.02;
  stripes=mod(stripes*20.0,1.0);
  stripes=pow(stripes,3.0 );

  // gl_FragColor=vec4(1.0,1.0,1.0,stripes);
  vec3 normal =normalize(vNormal);

  // 让背面的法向量也朝向观察者，保持与正面一致
  if(!gl_FrontFacing)
      normal*=-1.0;

  vec3 viewDirection=normalize(vPosition-cameraPosition);
  float fresnel=dot(viewDirection,normal);
  fresnel=fresnel+1.0;
  fresnel=pow(fresnel,2.0 );

  //falloff
  float falloff = smoothstep(0.8,0.0 ,fresnel );

  float holographic=fresnel*stripes;
  holographic+=fresnel*1.25;
  holographic*=falloff;

// 注意开启材质透明
  gl_FragColor=vec4(0.7,0.25,0.8,holographic);

  // 引入three.js的内置shader代码。开启toneMapping和colorSpace
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  
}
`
// Textures
const material = new THREE.ShaderMaterial({
  transparent:true,
  side:THREE.DoubleSide,
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=hologram) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
