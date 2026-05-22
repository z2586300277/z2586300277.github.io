---
title: "粒子星空 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子星空"
outline: deep
---
# 粒子星空

*Starry Sky*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=starrySky)

![粒子星空](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/starrySky.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

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
  uniform float iTime; 
  uniform vec2 iResolution; 
  varying vec2 vUv;  

  #define PASS_COUNT 1
  vec4 iMouse = vec4(.0, 0, 0.2, 0);
float fBrightness = 2.5;

// Number of angular segments
float fSteps = 121.0;

float fParticleSize = 0.015;
float fParticleLength = 0.5 / 60.0;

// Min and Max star position radius. Min must be present to prevent stars too near camera
float fMinDist = 0.8;
float fMaxDist = 5.0;

float fRepeatMin = 1.0;
float fRepeatMax = 2.0;

// fog density
float fDepthFade = 0.8;

float Random(float x)
{
return fract(sin(x * 123.456) * 23.4567 + sin(x * 345.678) * 45.6789 + sin(x * 456.789) * 56.789);
}

vec3 GetParticleColour( const in vec3 vParticlePos, const in float fParticleSize, const in vec3 vRayDir )
{		
vec2 vNormDir = normalize(vRayDir.xy);
float d1 = dot(vParticlePos.xy, vNormDir.xy) / length(vRayDir.xy);
vec3 vClosest2d = vRayDir * d1;

vec3 vClampedPos = vParticlePos;

vClampedPos.z = clamp(vClosest2d.z, vParticlePos.z - fParticleLength, vParticlePos.z + fParticleLength);

float d = dot(vClampedPos, vRayDir);

vec3 vClosestPos = vRayDir * d;

vec3 vDeltaPos = vClampedPos - vClosestPos;	
  
float fClosestDist = length(vDeltaPos) / fParticleSize;

float fShade = 	clamp(1.0 - fClosestDist, 0.0, 1.0);
  
fShade = fShade * exp2(-d * fDepthFade) * fBrightness;

return vec3(fShade);
}
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=starrySky) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
