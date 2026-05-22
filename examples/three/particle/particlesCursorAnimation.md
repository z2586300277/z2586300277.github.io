---
title: "鼠标轨迹粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,鼠标轨迹粒子"
outline: deep
---
# 鼠标轨迹粒子

*ParticlesCursorAnimation*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particlesCursorAnimation)

![鼠标轨迹粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particlesCursorAnimation.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const vertexShader=`
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform sampler2D uDispanecmentTexture;

attribute float aParticlesIntensity;
attribute float aAngle ;

void main(){
    vec3 newPosition=position;
    /*
    Dispanecment
    */
    // 读取canvas纹理中的红色通道作为R，影响粒子偏移
    float dispanecmentIntensity=texture2D(uDispanecmentTexture,uv).r;
    // 关键点：smoothstep
    // 这里0.1是为了过滤掉一些极小值，让图像再鼠标悬浮后能够复原。
    //同时设置一个0.7，让鼠标离开后能够保留粒子偏移后的轨迹一段时间
    dispanecmentIntensity =smoothstep( 0.1,0.7,dispanecmentIntensity);
    // 粒子的偏移向量，这里在xy平面进行随机旋转，在z轴上进行随机偏移
    vec3 displacement=vec3(
        cos(aAngle)*0.2,
        sin(aAngle)*0.2,
        1.0
    );
     displacement=normalize(displacement);
    displacement*=dispanecmentIntensity;
    displacement*=3.0;
    displacement*=aParticlesIntensity;

    newPosition+=displacement;

    float picIntensity=texture2D(uTexture,uv).r;
    
    vec4 modelPosition=modelMatrix*vec4(newPosition,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    // 计算法线变换矩阵：逆矩阵并转置
    mat3 normalMatrix=transpose(inverse(mat3(modelMatrix)));
    // 使用法线变换矩阵变换法线
    vec3 transformedNormal=normalize(normalMatrix*normal);
    vNormal=transformedNormal;
    
    vPosition=modelPosition.xyz;
    
    // 粒子动画的初始模版
    gl_PointSize=0.08*picIntensity*uResolution.y;
    gl_PointSize*=(1./-viewPosition.z);
    

    vColor=vec3(pow(picIntensity,2.0 ));
}
`
const fragmentShader=`
precision mediump float;

uniform vec2 uResolution;

uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereNightColor;
uniform sampler2D uTexture;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;

void main(){
  vec3 viewDirection=normalize(vPosition-cameraPosition);
  vec3 color=vec3(0.6392, 0.0392, 0.0392);
  vec2 uv=gl_PointCoord;
  float distanceToCenter=distance(uv,vec2(0.5,0.5) );
  if(distanceToCenter>0.5)
    discard;

  // color=vec3(alpha);

  gl_FragColor=vec4(vColor,1.0);
  
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`
/**
 * Base
 */
// Debug

// Canvas
const box = document.getElementById('box')

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: null,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(
  window.innerWidth * sizes.pixelRatio,
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particlesCursorAnimation) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
