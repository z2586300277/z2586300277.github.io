---
title: "下雪 - Three.js 案例讲解"
description: "Three.js 大量点/面片模拟粒子。主流程在 `init`、`onWindowResize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,下雪"
outline: deep
---

# 下雪

*Snow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=downSnow)


![下雪](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/downSnow.jpg)


## 效果说明

Three.js 大量点/面片模拟粒子。主流程在 `init`、`onWindowResize`。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `onWindowResize()` — 材质 / GLSL
- `animate()` — rAF：update controls + render
- `update()` — 材质 / GLSL
- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
let renderer, scene, camera, stats, controls;

let mesh, uniforms, geometry;
let snowMaterial;
const particles = 1000;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);

	scene = new THREE.Scene();

	snowMaterial = new THREE.PointsMaterial({
		size: 5,
		blending: THREE.AdditiveBlending,
		transparent: true,
	});

	geometry = new THREE.BufferGeometry();

	let positions = new Float32Array(particles * 3);

	for (let i = 0; i < particles * 3; i += 3) {
		positions[i] = Math.random() * 200 - 100;
		positions[i + 1] = Math.random() * 200 - 100;
		positions[i + 2] = Math.random() * 200 - 100;
	}
	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(positions, 3)
	);

	snowMaterial.onBeforeCompile = (shader) => {
		shader.uniforms.uColor = {
			value: new THREE.Color(0xffffff),
		};

		shader.fragmentShader = shader.fragmentShader.replace(
			`#include <common>`,
			`
                        #include <common>
                            uniform vec3 uColor;
                        `
		);

		shader.fragmentShader = shader.fragmentShader.replace(
			`#include <premultiplied_alpha_fragment>`,
			`
                       
```

