---
title: "火焰 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,火焰"
outline: deep
---
# 火焰

*Fire Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fireShader)

![火焰](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/fireShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

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
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 0.6)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const uniforms = {

    iTime: {

        value: 0

    },

    iResolution: {

        value: new THREE.Vector2(box.clientWidth, box.clientHeight)

    }

}

const geometry = new THREE.PlaneGeometry(1, 1)

const material = new THREE.ShaderMaterial({

    uniforms,

    transparent: true,

    side: THREE.DoubleSide,

    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() { 
          vUv = uv; 
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
      }
  `,
    fragmentShader: `
    const float PI = 3.14159265359; 
        
    uniform float iTime;
    uniform vec2 iResolution; 
      
    varying vec2 vUv;
    
    vec3 firePalette(float i){
    
        float T = 1400. + 1300.*i; // Temperature range (in Kelvin).
        vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
        L = pow(L,vec3(5)) * (exp(1.43876719683e5/(T*L)) - 1.);
        return 1. - exp(-5e8/L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
    } 
    vec3 hash33(vec3 p){ 
        
        float n = sin(dot(p, vec3(7, 157, 113)));    
        return fract(vec3(2097152, 262144, 32768)*n); 
    }
    
    float voronoi(vec3 p){
    
        vec3 b, r, g = floor(p);
        p = fract(p); // "p -= g;" works on some GPUs, but not all, for some annoying reason.
        
        float d = 1.;  
        for(int j = -1; j <= 1; j++) {
            for(int i = -1; i <= 1; i++) {
                
                b = vec3(i, j, -1);
                r = b - p + hash33(g+b);
                d = min(d, dot(r,r));
                
                b.z = 0.0;
                r = b - p + hash33(g+b);
                d = min(d, dot(r,r));
                
                b.z = 1.;
                r = b - p + hash33(g+b);
                d = min(d, dot(r,r));
                    
            }
        }
        
        return d; // Range: [0, 1]
    }
    
    float noiseLayers(in vec3 p) {
    
        vec3 t = vec3(0., 0., p.z + iTime*1.5);
    
        const int iter = 5; // Just five layers is enough.
        float tot = 0., sum = 0., amp = 1.; // Total, sum, amplitude.
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fireShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
