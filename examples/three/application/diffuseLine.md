---
title: "发散飞线 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `InitFly`。"
head:
  - - meta
    - name: keywords
      content: "three.js,发散飞线"
outline: deep
---

# 发散飞线

*Diffuse Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=diffuseLine)


![发散飞线](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/diffuseLine.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `InitFly`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点击选中：`Raycaster` + 鼠标 NDC 坐标，`intersectObjects` 取交点。

## 类与方法

### InitFly

- `constructor()` — 参数：{
        texture
    } = opt
- `tranformPath()`
- `remove()` — 移除 Entity / 解绑监听
- `animation()` — 移除 Entity / 解绑监听
- `color()`
- `getColorArr()`

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

class InitFly {
    constructor({
        texture
    } = opt) {
        this.flyId = 0; //id
        this.flyArr = []; //存储所有飞线
        this.baicSpeed = 1; //基础速度
        this.texture = 0.0;
        if (texture && !texture.isTexture) {
            this.texture = new THREE.TextureLoader().load(texture)
        } else {
            this.texture = texture;
        }
        this.flyShader = {
            vertexshader: ` 
                uniform float size; 
                uniform float time; 
                uniform float u_len; 
                attribute float u_index;
                varying float u_opacitys;
                void main() { 
                    if( u_index < time + u_len && u_index > time){
                        float u_scale = 1.0 - (time + u_len - u_index) /u_len;
                        u_opacitys = u_scale;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                        gl_PointSize = size * u_scale * 300.0 / (-mvPosition.z);
                    } 
                }
                `,
            fragmentshader: ` 
                uniform sample
```

