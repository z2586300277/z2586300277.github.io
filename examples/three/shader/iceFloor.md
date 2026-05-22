---
title: "冰面 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,冰面,着色器"
outline: deep
---

# 冰面

*Ice Floor*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=iceFloor)


![冰面](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/iceFloor.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

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
uniform float uParallaxDistance;

		varying vec2 vParallax;
		varying vec2 vUv;

		void main() {

		vUv = uv;

		vec3 pos = position;
		vec4 wPos = modelMatrix * vec4(pos, 1.0);

		mat3 tbn = mat3(vec3(1.,0,0), vec3(0,0.,-1.), vec3(0.,1.,0.));
		tbn = transpose(tbn);

		vec3 viewDir = normalize(wPos.xyz - cameraPosition);
		vec3 tbnViewDir = tbn * viewDir;

		vParallax = tbnViewDir.xy;
		vParallax *= uParallaxDistance / dot(-tbnViewDir, vec3(0.0,0.0,1.0));

		gl_Position = projectionMatrix * viewMatrix * wPos;

	}
```

### 片元

```glsl
uniform sampler2D uCracksMap;
		uniform sampler2D uTrailMap;
		uniform sampler2D uPerlin;

		varying vec2 vParallax;
		varying vec2 vUv;

		void main() {

		float perlin = texture(uPerlin, vUv).r;
		float perlin2 = texture(uPerlin, vUv * 10.).r;
		vec3 trail = texture(uTrailMap, vUv).rgb;
		float cracks = texture(uCracksMap, vUv * 4.).r;
		float nomalization = 1.0;

		vec3 colorBlue = vec3(0.0,0.2,0.25);
		vec3 colorDeepBlue = vec3(0.0,0.01,0.03);
		vec3 colorGreen = vec3(0.1,0.2,0.35);

		float accumulateFrosted = 0.;

		for (int i = 0; i < 50; i++) {
			float aplitude =
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// https://github.com/rock-biter/ice-trails
const textureLoader = new THREE.TextureLoader()
const crackMap = textureLoader.load(FILE_HOST + 'images/shader/cracks.png')
crackMap.wrapS = THREE.RepeatWrapping
crackMap.wrapT = THREE.RepeatWrapping
const perlinMap = textureLoader.load(FILE_HOST + 'images/shader/smokeMap.png')
perlinMap.wrapS = THREE.RepeatWrapping
perlinMap.wrapT = THREE.RepeatWrapping
const groundMaterial = new THREE.ShaderMaterial({
	vertexShader: `
		uniform float uParallaxDistance;

		varying vec2 vParallax;
		varying vec2 vUv;

		void main() {

		vUv = uv;

		vec3 pos = position;
		vec4 wPos = modelMatrix * vec4(pos, 1.0);

		mat3 tbn = mat3(vec3(1.,0,0), vec3(0,0.,-1.), vec3(0.,1.,0.));
		tbn = transpose(tbn);

		vec3 view
```

