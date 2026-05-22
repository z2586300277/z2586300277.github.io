---
title: "粒子烟花 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子烟花"
outline: deep
---
# 粒子烟花

*Fire*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleFire)

![粒子烟花](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleFire.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

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
  texture,
  radius = 1,
  color
) => {
  if (!texture && texture instanceof THREE.Texture) return;
  // 反转纹理
  texture.flipY = false;
  const positionsArray = new Float32Array(count * 3);

  // 粒子的随机大小
  const sizeArray = new Float32Array(count);
  // 粒子的随机存在寿命
  const lifeArray = new Float32Array(count);
  for (let index = 0; index < count; index++) {
    const spherical = new THREE.Spherical(
      radius * (0.75 + (Math.random() - 0.5) * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );
    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positionsArray[index * 3] = position.x;
    positionsArray[index * 3 + 1] = position.y;
    positionsArray[index * 3 + 2] = position.z;

    sizeArray[index] = Math.random();
    // 粒子的寿命只能够在原有的基础上的更短，
    //这样烟花粒子就消失的更快,会在vs基于原有的寿命乘上这个值
    lifeArray[index] = Math.random() + 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionsArray, 3)
  );
  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizeArray, 1)
  );
  geometry.setAttribute(
    "aLife",
    new THREE.Float32BufferAttribute(lifeArray, 1)
  );
  const material = new THREE.ShaderMaterial({
    fragmentShader:`
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
      
    }`,
    vertexShader:`#include <common>
    precision mediump float;
    
    attribute float aSize;
    attribute float aLife;
    
    uniform float uTime;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleFire) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
