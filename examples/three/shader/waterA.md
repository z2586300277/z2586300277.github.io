---
title: "波浪效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,水效果"
outline: deep
---

# 波浪效果

*Water Effect*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waterA)


![波浪效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/waterA.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 
import * as dat from 'dat.gui'
const gui = new dat.GUI();

const box = document.getElementById("box");

// 假设typeState已经被定义
const typeState = {
  color: "#0670c1",
  speed: 0.1,
  brightness: 1.5,
  flowSpeed: { x: 0.01, y: 0.01 },
};

let vertexShader = `// Examples of variables passed from vertex to fragment shader
varying vec2 vUv;

void main(){
	// To pass variables to the fragment shader, you assign them here in the
	// main function. Traditionally you name the varying with vAttributeName
	vUv=uv;
	
	// This sets the position of the vertex in 3d space. The correct math is
	// provided below to take into account camera and object data.
	gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}`;
let fragmentShader = `#define TAU 6.28318530718
#define MAX_ITER 5

uniform vec2 resolution;
uniform vec3 backgroundColor;
uniform vec3 color;
uniform float speed;
uniform vec2 flowSpeed;
uniform float brightness;
uniform float time;

varying vec2 vUv;

void main(){
	vec2 uv=(vUv.xy+(time*flowSpeed))*resolution;
	
	vec2 p=mod(uv*TAU,TAU)-250.;
	vec2 i=vec2(p);
	
	float c=1.;
	float inten=.005;
	
	for(int n=0;n<MAX_ITER;n++){
		float t=time*speed*(1.-(3.5/float(n+1)));
		i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+
```

