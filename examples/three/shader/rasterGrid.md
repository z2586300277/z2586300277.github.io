---
title: "栅格网格 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,栅格网格"
outline: deep
---

# 栅格网格

*Raster Grid*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=rasterGrid)


![栅格网格](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/rasterGrid.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 类与方法

### Base

- `constructor()` — 初始化成员
- `main()` — 材质 / GLSL
- `init()`
- `animate()` — 材质 / GLSL

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const { innerWidth, innerHeight } = window;
const aspect = innerWidth / innerHeight;

class Base {
    constructor() {
        this.init();
        this.main();
    }
    main() {
        const geometry = new THREE.PlaneGeometry(10,10,100,100);

        const vertexShader = `
        varying vec2 vUv;

        void main(){
            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

        }
        `;
        const fragmentShader = `
        uniform float iTime;
        varying vec2 vUv;
        #define PI 3.14159

        vec3 palette(float t){
            vec3 a = vec3(0.5,0.5,0.5);
            vec3 b = vec3(0.5,0.5,0.5);
            vec3 c = vec3(1.0,1.0,1.0);
            vec3 d = vec3(0.263,0.416,0.557);

            return a+b*cos(PI*2.0*(c*t+d));
        }

        vec4 mainImage(){
            vec3 finalColor = vec3(0.0);
            vec2 uuv = vUv*2.0-1.0;
            vec2 uv = vUv*2.0-1.0;
            for(float i = 0.0;i<4.0;i++){
                uv = fract(uv*1.5)-0.5;
                float d = length(uv) * exp(-length(uuv));

                vec3 col = palette(length(uuv) + i*.4 + iTime*.4);

                d = sin(d*8. + iTime)/8.;
                d = abs(d);

    
```

