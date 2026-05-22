---
title: "围墙着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,围墙着色器"
outline: deep
---
# 围墙着色器

*Fence Wall*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fenceWall)

![围墙着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/fenceWall.jpg)

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
                        
                        float x = vUv.x;

                        float y = sin(x * frequency) ;
                        float t = 0.01*(-uTime*130.0);
                        y += sin(x*frequency*2.1 + t)*4.5;
                        y += sin(x*frequency*1.72 + t*1.121)*4.0;
                        y += sin(x*frequency*2.221 + t*0.437)*5.0;
                        y += sin(x*frequency*3.1122+ t*4.269)*2.5;
                        y *= amplitude*0.06;
                        y /= 3.;
                        y += 0.55;

                        vec4 color = gl_FragColor.rgba;

                        float r = step(0.5, fract(vUv.y - uTime));

                        baseColor.a = step(vUv.y,y) * (y-vUv.y)/y;
                        
                        gl_FragColor = baseColor;

                        }
                        `,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.y += 10;
        this.scene.add(cylinder);
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
        this.camera.position.set(0, 40, 40);

        this.scene = new THREE.Scene();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.deltaTime = {
            value: 0,
        };

        const grid = new THREE.GridHelper(100);
        this.scene.add(grid);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
    }
    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.deltaTime.value = this.clock.getElapsedTime();
    }
}
new Base();
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fenceWall) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
