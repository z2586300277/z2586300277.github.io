---
title: "海面 - Three.js 案例讲解"
description: "Three.js Water 对象、法线贴图与 time uniform 波浪动画"
head:
  - - meta
    - name: keywords
      content: "three.js,Water,海面,waternormals,examples/jsm"
outline: deep
---

# 海面

*Ocean Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=oceanShader)

![海面](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/oceanShader.jpg)

## 你将学到什么

- 官方 **`Water`** 对象（`examples/jsm/objects/Water.js`）
- `waterNormals` 法线贴图 + **RepeatWrapping**
- `uniforms.time` 驱动波浪
- lil-gui 调 **waterColor / sunColor / sunDirection**

## 效果说明

万级平面海面荡漾，天空盒反射；GLTF 挖掘机模型设 `envMap` 与环境一致；GUI 实时改水体与太阳参数。

## 核心概念

```js
import { Water } from 'three/examples/jsm/objects/Water.js';

const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load('waternormals.jpg', t => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
});
water.rotation.x = -Math.PI / 2;
```

### 动画

```js
water.material.uniforms['time'].value += 1.0 / 60.0;
```

每帧递增 `time`，Water 内部 shader 算法线偏移与反射。

### GUI

```js
gui.addColor(water.material.uniforms['waterColor'], 'value');
gui.add(water.material.uniforms['sunDirection'].value, 'x', -1, 1);
```

## 实现步骤

1. PlaneGeometry 10000×10000 创建 Water
2. CubeTexture 天空盒 → background + 模型 envMap
3. GLTFLoader 加载场景模型
4. animate 更新 time + controls + render

## 小结

- 真实海洋优先 **Water**；完全自定义可写 ShaderMaterial + FFT 波浪
- 上一篇：[城市混合扫光](/examples/three/shader/cityBlendLight) · 下一篇：[中国旗帜](/examples/three/shader/chinaFlag)

> 着色器 · Three.js · 6/89
