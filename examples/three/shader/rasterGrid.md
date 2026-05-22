---
title: "栅格网格 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,栅格网格"
outline: deep
---
# 栅格网格

*Raster Grid*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=rasterGrid)

![栅格网格](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/rasterGrid.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

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

                d = pow(0.01 / d, 1.2);

                finalColor += col * d;
            }
            return  vec4(finalColor,1.0);
        }
        void main(){
            gl_FragColor = mainImage();
        }
        `;
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                iTime: {
                    value: 0,
                },
            },
            side: THREE.DoubleSide,
        });

        const plane = new THREE.Mesh(geometry, material);
        this.material = plane.material;
        this.scene.add(plane);
    }
    init() {
        this.clock = new THREE.Clock();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.01, 10000);
        this.camera.position.set(5, 5, 5);

        this.scene = new THREE.Scene();

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        const grid = new THREE.GridHelper(100);
        this.scene.add(grid);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
    }
    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.material.uniforms.iTime.value += 0.01;
    }
}
new Base();
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=rasterGrid) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
