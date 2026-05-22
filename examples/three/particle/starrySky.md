---
title: "粒子星空 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,粒子星空,粒子"
outline: deep
---

# 粒子星空

*Starry Sky*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=starrySky)


![粒子星空](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/starrySky.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec3 vPosition;
      varying vec2 vUv;
      void main() { 
          vUv = uv; 
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
      }
```

### 片元

```glsl
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
return fract(sin(x * 123.456) * 23.4567 + sin(x
```

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
  
```

```js
/*	vec2 vScreenUV = fragCoord.xy / iResolution.xy;

vec2 vScreenPos = vScreenUV * 2.0 - 1.0;
vScreenPos.x *= iResolution.x / iResolution.y;

vec3 vRayDir = normalize(vec3(vScreenPos, 1.0));

vec3 vEuler = vec3(0.5 + sin(iTime * 0.2) * 0.125, 0.5 + sin(iTime * 0.1) * 0.125, iTime * 0.1 + sin(iTime * 0.3) * 0.5);
	  
if(iMouse.z > 0.0)
{
  vEuler.x = -((iMouse.y / iResolution.y) * 2.0 - 1.0);
  vEuler.y = -((iMouse.x / iResolution.x) * 2.0 - 1.0);
  vEuler.z = 0.0;
}
  
vRayDir = RotateX(vRayDir, vEuler.x);
vRayDir = RotateY(vRayDir, vEuler.y);
vRayDir = RotateZ(vRayDir, vEuler.z);
*/	
float fShade = 0.0;
  
float a = 0.2;
float b = 10.0;
float c = 1.0;
float fZPos = 5.0 + iTime * c + sin(iTime * a) * b;
float fSpeed = c + a * b * cos(a * iTime);

fParticleLength = 0.25 * fSpeed / 60.0;

float fSeed = 0.0;

vec3 vResult = mix(vec3(0.005, 0.0, 0.01), vec3(0.01, 0.005, 0.0), vRayDir.y * 0.5 + 0.5);

for(int i=0; i<PASS_COUNT; i++)
{
  vResult += Starfield(vRayDir, fZPos, fSeed);
  fSeed += 1.234;
}

fragColor = vec4(sqrt(vResult),1.0);
}

  void main(void) { 
	   
	  vec2 vScreenUV = (vUv - 0.5) * 10.0;

vec2 vScreenPos = vScreenUV * 2.0 - 1.0;
vScreenPos.x *= iResolution.x / iResolution.y;

vec3 vRayDir = normalize(vec3(vScreenPos, 1.0));

vec3 vEuler = vec3(0.5 + sin(iTime * 0.2) * 0.125, 0.5 + sin(iTime * 0.1) * 0.125, iTime * 
```

