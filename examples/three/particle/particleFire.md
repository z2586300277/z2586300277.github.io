---
title: "粒子烟花 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createFireWork`、`destory`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,粒子烟花,粒子"
outline: deep
---

# 粒子烟花

*Fire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleFire)


![粒子烟花](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleFire.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createFireWork`、`destory`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 着色器

### 片元

- 片元输出 gl_FragColor
- `time` uniform 驱动动画

```glsl
precision mediump float;
    
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    uniform float uTime;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main(){
    // 注意开启材质透明
    
      float textureAlpha=texture(uTexture,gl_PointCoord).r;
    
      gl_FragColor=vec4(uColor, textureAlpha);
    
      // 引入three.js的内置shader代码。开启toneMapping和colorSpace
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      
    }
```

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
#include <common>
    precision mediump float;
    
    attribute float aSize;
    attribute float aLife;
    
    uniform float uTime;
    uniform float uSize;
    uniform vec2 uResolution;
    uniform float uProgress;
    
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    float linearFunction (float x,float x1,float y1,float x2,float y2) {
        return x*((y2-y1)/(x2-x1))+(y2-((y2-y1)/(x2-x1))*x2);
    }
    
    
    void main(){
        /**
        * Position
        */
        vec3 newPosition=position;
    
        newPosition=newPosition;
 
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: null,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(
  window.innerWidth * sizes.pixelRatio,
  window.innerHeight * sizes.pixelRatio
);

const textureLoader = new THREE.TextureLoader();

const textures = [
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/1.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/10.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/3.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/4.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/5.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/6.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/7.png"),
  textureLoader.load(FILE_HOST + "threeExamples/particle/particleFire/8.png"),
];

/**
 *
 * @param {粒子数目} count
 * @param {烟花位置} position
 * @param {烟花粒子大小} size
 * @param {纹理} texture
 *  @param {烟花半径} radius
 * @param {颜色}color
 */
const createFireWork = async (
  count,
  position,
  size,

```

