---
title: "下雨效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,下雨效果,应用场景"
outline: deep
---

# 下雨效果

*Rain Roof*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=rainRoof)


![下雨效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/rainRoof.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 实现思路

- 大量重复物体用 `InstancedMesh`，一次 draw call；矩阵写 `setMatrixAt`。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class DepthData extends THREE.WebGLRenderTarget{
  constructor(size, camParams){
    super(size, size);
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;
    this.stencilBuffer = false;
    this.depthTexture = new THREE.DepthTexture();
    this.depthTexture.format = THREE.DepthFormat;
    this.depthTexture.type = THREE.UnsignedIntType;
    
    let hw = camParams.width * 0.5;
    let hh = camParams.height * 0.5;
    let d = camParams.depth;
    this.depthCam = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0, d);
    this.depthCam.layers.set(1);
    this.depthCam.position.set(0, d, 0);
    this.depthCam.lookAt(0, 0, 0);
  }
  
  update(){
    renderer.setRenderTarget(this);
    renderer.render(scene, this.depthCam);
    renderer.setRenderTarget(null);
  }
}

class Rain extends THREE.Line{
  constructor(size, amount){
    let v = new THREE.Vector3();
    let gBase = new THREE.BufferGeometry().setFromPoints([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1)])
    let g = new THREE.InstancedBufferGeometry().copy(gBase)
    g.setAttribute("instPos", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: amount}, () => {
          v.random().subScalar(0.5);
    
```

