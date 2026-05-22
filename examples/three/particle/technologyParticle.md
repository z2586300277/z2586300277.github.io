---
title: "科技粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,科技粒子"
outline: deep
---
# 科技粒子

*Technology*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=technologyParticle)

![科技粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/technologyParticle.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

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

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 25)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const curve = new THREE.EllipseCurve(0, 0, 8, 8, 0, 2 * Math.PI, false, 0);
let pointsPos = [];

for (let i = 0; i < 5; i++) {
    pointsPos.push(...curve.getPoints(719));
    curve.xRadius += 0.2;
    curve.yRadius += 0.2;
}

const aIndex = pointsPos.map((_, index) => index);
const geometry = new THREE.BufferGeometry().setFromPoints(pointsPos);

geometry.rotateX(Math.PI * 0.5);
geometry.translate(0, 0.1, 2.5);

const geoPosList = geometry.getAttribute('position').array;
const aNormals = new Float32Array(geoPosList.length);

for (let i = 0; i < geoPosList.length / 3; i++) {

    const i3 = i * 3;
    geoPosList[i3 + 1] += Math.floor(i / 720) * 0.15;
    const baseIndex = (i % 720) * 3;
    const offsetIndex = ((i % 720) + 720 * 4) * 3;
    aNormals[i3] = geoPosList[offsetIndex] - geoPosList[baseIndex];
    aNormals[i3 + 1] = geoPosList[offsetIndex + 1] - geoPosList[baseIndex + 1];
    aNormals[i3 + 2] = geoPosList[offsetIndex + 2] - geoPosList[baseIndex + 2];
    
}

geometry.setAttribute('aNormal', new THREE.BufferAttribute(aNormals, 3));
geometry.setAttribute('aIndex', new THREE.BufferAttribute(new Float32Array(aIndex), 1));
geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(geoPosList), 3));

const pointsMaterial = new THREE.PointsMaterial({
    color: 0x409eff,
    size: 0.4,
    map: new THREE.TextureLoader().load(FILE_HOST + 'images/texture/circle.png'),
    alphaMap: new THREE.TextureLoader().load(FILE_HOST + 'images/texture/circle.png'),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
});

const uTime = { value: 0 };
pointsMaterial.onBeforeCompile = ((shader) => {

    shader.uniforms.uTime = uTime
    shader.uniforms.uPerlinTexture = { value: new THREE.TextureLoader().load(FILE_HOST + 'images/texture/noise.png') };
    shader.uniforms.baseColor1 = { value: new THREE.Color(0x90EE90) };
    shader.uniforms.baseColor2 = { value: new THREE.Color(0xFFA500) };
    shader.uniforms.baseColor3 = { value: new THREE.Color(0x9B30FF) };
    shader.vertexShader = shader.vertexShader.replace("#include <common>",
    `#include <common>
    attribute float aIndex;
    attribute vec3 aNormal;
    uniform float uTime;
    uniform sampler2D uPerlinTexture;
    varying float vIndex;
    varying float vSelfIndex;
    varying float vCircleNum;
    
    float getStrength(float aIndex,float uTime,vec3 aNormal){
            float selfIndex = mod(aIndex, 720.0);      // 计算每个点在圆环上的位置索引
            float circleNum = (aIndex - selfIndex) / 720.0; // 计算点所在的“圈号”，但此值目前未使用
        
            vec3 pDir = normalize(aNormal);            // 获取法线方向，后续将用其调整偏移方向
            float waveWidth = 90.0;                    // 波动效果的宽度
            float totalLength = 720.0;                 // 圆的总长度（720度）
            float modUtime = mod(uTime * 50.0, 720.0); // 时间的循环，乘以 30.0 是加速效果
            float dw = waveWidth*0.5;              // 平滑过渡的宽度，控制波动的范围
        
            // 计算波动强度
            // 对首尾连接部分（0 和 720）进行平滑过渡处理
            float smoothStart = smoothstep(modUtime , modUtime+dw, selfIndex);
            float smoothEnd = 1.0-smoothstep(modUtime+waveWidth - dw,modUtime+waveWidth, selfIndex);
            
            // 创建平滑连接：确保波动在 [720 - dw, 720 + waveWidth] 和 [0, dw] 区间内平滑过渡
            float strength = min(smoothStart,smoothEnd);
            
            
            float isOver=step(720.0,modUtime+waveWidth);
            float over=(modUtime+waveWidth-720.0);
            float isOverStep1=(1.0-step(dw,over))*isOver;
            float isOverStep2=step(dw,over);
            
            float overStep1Left=min(smoothstep(modUtime,modUtime+dw,selfIndex),(1.0-smoothstep(modUtime+waveWidth - dw,modUtime+waveWidth, selfIndex)));
            float overStep1Right=1.0-smoothstep(modUtime+waveWidth - dw,modUtime+waveWidth, selfIndex+720.0);
            float overStep1=max(overStep1Left,overStep1Right);
            
            float overStep2Left=smoothstep(modUtime,modUtime+dw,selfIndex);
            float overStep2Right=min(smoothstep(modUtime,modUtime+dw,selfIndex+720.0),(1.0-smoothstep(modUtime+waveWidth - dw,modUtime+waveWidth, selfIndex+720.0)));
            float overStep2=max(overStep2Left,overStep2Right);
            
            float os=isOverStep1*overStep1+overStep2*isOverStep2;

            strength=(1.0-isOver)*strength+isOver*os;
            return strength;
        }
    `
    );
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=technologyParticle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
