---
title: "鼠标轨迹粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,鼠标轨迹粒子,粒子"
outline: deep
---

# 鼠标轨迹粒子

*ParticlesCursorAnimation*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particlesCursorAnimation)


![鼠标轨迹粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particlesCursorAnimation.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 代码结构

- Dispanecment

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
```

### Dispanecment

```js
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
uniform vec3 uAtmo
```

