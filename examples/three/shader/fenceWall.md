---
title: "围墙着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,围墙着色器"
outline: deep
---

# 围墙着色器

*Fence Wall*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fenceWall)


![围墙着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/fenceWall.jpg)


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
- `animate()`

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec2 vUv; 
                        void main(){
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                        }
```

### 片元

- `time` uniform 驱动动画

```glsl
uniform float uTime;
                        varying vec2 vUv;
                        #define PI 3.14159265

                        void main(){

                        vec4 baseColor = vec4(0.0,1.,0.5,1.);
						
                        vec4 finalColor;
                            
                        float amplitude = 1.;
                        float frequency = 10.;
                        
                        float x = vUv.x;

                        float y = sin(x * frequency) ;
                        float t = 0.01*(-uTime*130.0);
                        y 
```

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
        const geometry = new THREE.CylinderGeometry(30, 30, 20, 4, 64, true);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uTime: this.deltaTime,
            },
            vertexShader: `
                        varying vec2 vUv; 
                        void main(){
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                        }
                        `,
            fragmentShader: `
                        uniform float uTime;
                        varying vec2 vUv;
                        #define PI 3.14159265

                        void main(){

                        vec4 baseColor = vec4(0.0,1.,0.5,1.);
						
                        vec4 finalColor;
                            
                        float amplitude = 1.;
                        float frequency = 10.;
                        
           
```

