---
title: "下雨效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,下雨效果"
outline: deep
---
# 下雨效果

*Rain Roof*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=rainRoof)

![下雨效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/rainRoof.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 离屏渲染 RenderTarget
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **WebGLRenderTarget** 渲染到纹理，用于镜子、小地图、后处理输入。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

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
          v.y += 0.5;
          v.multiply(size);
          return [...v];
        }).flat()
      ), 3
    ))
    g.instanceCount = amount;
    
    let m = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      onBeforeCompile: shader => {
        shader.uniforms.depthData = gu.depthData;
        shader.uniforms.time = gu.time;
        shader.vertexShader = `
          uniform float time;
          
          attribute vec3 instPos;
          
          varying float colorTransition;
          varying vec3 vPos;
          ${shader.vertexShader}
        `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          
          float t = time;
          vec3 iPos = instPos;
          iPos.y = mod(20. - instPos.y - t * 5., 20.);
          
          transformed.y *= 0.5;
          transformed += iPos;
          
          vPos = transformed;
          
          colorTransition = position.y;
          `
        );
        //console.log(shader.vertexShader);
        
        shader.fragmentShader = `
          uniform sampler2D depthData;
          varying float colorTransition;
          varying vec3 vPos;
          ${shader.fragmentShader}
        `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `
          vec2 depthUV = (vPos.xz + 10.) / 20.;
          depthUV.y = 1. - depthUV.y;
          
          float depthVal = 1. - texture(depthData, depthUV).r;
          float actualDepth = depthVal * 20.;
          
          if(vPos.y < actualDepth) discard;
          
          float trns = 1. - colorTransition;
          
          float distVal = smoothstep(3., 0., vPos.y - actualDepth);
          vec3 col = mix(diffuse, vec3(0.9), distVal); // the closer, the whiter
          vec4 diffuseColor = vec4( mix(col, col + 0.1, pow(trns, 16.)), (opacity * (0.25 + 0.75 * distVal)) * trns );
          `
        );
        //console.log(shader.fragmentShader);
      }
    })
    super(g, m);
    this.frustumCulled = false;
  }
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
camera.position.set(3, 5, 13).setLength(50);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=rainRoof) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
