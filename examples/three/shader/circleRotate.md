---
title: "旋转的圆 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,旋转的圆"
outline: deep
---
# 旋转的圆

*Circle Rotate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=circleRotate)

![旋转的圆](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/circleRotate.jpg)

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

camera.position.set(0, 0, 1.5)

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
    uniform float iTime;
    uniform vec2 iResolution; 
    varying vec2 iMouse;
    varying vec2 vUv;

    #define PI 3.1415926
    #define NUM 20.
    #define PALETTE vec3(.0, 1.4, 2.)+1.5

    #define COLORED
    #define MIRROR
    //#define ROTATE
    #define ROT_OFST
    #define TRIANGLE_NOISE

    //#define SHOW_TRIANGLE_NOISE_ONLY

    mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}
    float tri(in float x){return abs(fract(x)-.5);}
    vec2 tri2(in vec2 p){return vec2(tri(p.x+tri(p.y*2.)),tri(p.y+tri(p.x*2.)));}
    mat2 m2 = mat2( 0.970,  0.242, -0.242,  0.970 );

    float triangleNoise(in vec2 p)
    {
        float z=1.5;
        float z2=1.5;
      float rz = 0.;
        vec2 bp = p;
      for (float i=0.; i<=3.; i++ )
      {
            vec2 dg = tri2(bp*2.)*.8;
            dg *= mm2(iTime*.3);
            p += dg/z2;

            bp *= 1.6;
            z2 *= .6;
        z *= 1.8;
        p *= 1.2;
            p*= m2;
            
            rz+= (tri(p.x+tri(p.y)))/z;
      }
      return rz;
    }
            
    void main(void) {
        float time = iTime* 1.2;
        float aspect = iResolution.x/iResolution.y;
    float w = 50./sqrt(iResolution.x*aspect+iResolution.y);

        vec2 p = (vUv -0.5) * 2.0 ;
        p.x *= aspect;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=circleRotate) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
