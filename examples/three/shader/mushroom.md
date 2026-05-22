---
title: "蘑菇 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,蘑菇"
outline: deep
---
# 蘑菇

*Mushroom*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=mushroom)

![蘑菇](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/mushroom.jpg)

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
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, DOM.clientWidth / DOM.clientHeight, 0.1, 100000)
camera.position.set(10, 10, 10)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
renderer.setPixelRatio(window.devicePixelRatio * 2)
renderer.setClearColor(0x000000)
DOM.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const uniforms = {
    Mouse: {
        type: 'v2',
        value: new THREE.Vector2(0, 0)
    },
    Resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    Time: {
        type: 'f',
        value: 1.0
    }
}

DOM.addEventListener('mousemove', (event) => uniforms.Mouse.value = new THREE.Vector2(
    (event.offsetX / event.target.clientWidth) * 2 - 1,
    -(event.offsetY / event.target.clientHeight) * 2 + 1
))
const geometry = new THREE.BoxGeometry(10, 10, 10);

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `varying vec2 vUv;
    void main(){
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
        vUv=uv;
    }`,
    fragmentShader: `#ifdef GL_ES
    precision mediump float;
    #endif
    uniform vec2 Resolution;
    uniform vec3 Mouse;
    uniform float Time;
    varying vec2 vUv;
    
    mat2 rot2D(float angle){
      float s=sin(angle);
      float c=cos(angle);
      return mat2(c,-s,s,c);
    }
    
    float sdCutHollowSphere(vec3 p,float r,float h,float t)
    {
      float w=sqrt(r*r-h*h);
      vec2 q=vec2(length(p.xz),p.y);
      return((h*q.x<w*q.y)?length(q-vec2(w,h)):
      abs(length(q)-r))-t;
    }
    vec4 sdstripe(vec3 p,vec3 color){
      p.xz=abs(p.xz);
      float d1=sdCutHollowSphere(p-vec3(.0,-3.3,0.),.8,.01,.01);
      float d2=sdCutHollowSphere(p-vec3(.9,-3.3,.9),.5,.005,.01);
      float d=min(d1,d2);
      return vec4(d,color);
    }
    vec4 sdCutSphere(vec3 p,float r,float h,vec3 color)
    {
      
      float w=sqrt(r*r-h*h);
      
      vec2 q=vec2(length(p.xz),p.y);
      float s=max((h-r)*q.x*q.x+w*w*(h+r-2.*q.y),h*q.x-w*q.y);
      float d=(s<0.)?length(q)-r:
      (q.x<w)?h-q.y:
      length(q-vec2(w,h));
      
      return vec4(d,color);
    }
    vec4 sdPlane(vec3 p,vec3 color){
      return vec4(-p.y+.2,color);
      
    }
    vec4 sdCappedCone(vec3 p,vec3 a,vec3 b,float ra,float rb,vec3 color)
    {
      float rba=rb-ra;
      float baba=dot(b-a,b-a);
      float papa=dot(p-a,p-a);
      float paba=dot(p-a,b-a)/baba;
      float x=sqrt(papa-paba*paba*baba);
      float cax=max(0.,x-((paba<.5)?ra:rb));
      float cay=abs(paba-.5)-.5;
      float k=rba*rba+baba;
      float f=clamp((rba*(x-ra)+paba*baba)/k,0.,1.);
      float cbx=x-ra-f*rba;
      float cby=paba-f;
      float s=(cbx<0.&&cay<0.)?-1.:1.;
      return vec4(s*sqrt(min(cax*cax+cay*cay*baba,
          cbx*cbx+cby*cby*baba)),color);
        }
        float smin(float d1,float d2,float k){
          float h=clamp(.5+.5*(d2-d1)/k,0.,1.);
          return mix(d2,d1,h)-k*h*(1.-h);
        }
        vec4 colorMin(vec4 a,vec4 b){
          if(a.x<b.x){
            return a;
          }else{
            return b;
          }
        }
        //模糊摆动，y的值越大，摆动频率越大
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=mushroom) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
