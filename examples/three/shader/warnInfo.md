---
title: "警告信息 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,警告信息"
outline: deep
---

# 警告信息

*Warn Info*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=warnInfo)


![警告信息](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/warnInfo.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

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
                            void main() {
                                vUv = uv;
                                
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                            }
```

### 片元

- `time` uniform 驱动动画

```glsl
varying vec2 vUv;
                            uniform float uTime;

                            void main(){
                                vec3 color = vec3(1.0,0.0,0.0);

                                vec2 center = vec2(0.5,0.5);

                                float dis = distance(vUv,center);

                                float p = 6.0;

                                float r =  fract(dis* p - uTime)/3. + step(0.99, fract(dis* p - uTime));
                                
                                
                                if(dis> 0.5 ){
               
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { innerWidth, innerHeight } = window;
const aspect = innerWidth / innerHeight;

class Base {
    constructor() {
        this.init();
        this.main();
    }
    main() {
        const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {
                uTime: this.elapsedTime,
            },
            vertexShader: `
                            varying vec2 vUv;
                            void main() {
                                vUv = uv;
                                
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                            }
                        `,
            fragmentShader: `
                            varying vec2 vUv;
                            uniform float uTime;

                            void main(){
                                vec3 color = vec3(1.0,0.0,0.0);

                                vec2 center = vec2(0.5,0.5);

                                float dis = distance(vUv,center);

                                fl
```

