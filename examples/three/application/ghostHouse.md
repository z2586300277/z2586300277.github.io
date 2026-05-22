---
title: "鬼屋 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `tick`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,鬼屋,应用场景"
outline: deep
---

# 鬼屋

*Ghost House*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=ghostHouse)


![鬼屋](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/ghostHouse.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `tick`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

const getRandomIntInclusive = function (min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 包含最小值和最大值
}

const setAoMapEnable = function (mesh) {
	mesh.geometry.setAttribute('uv2',
		new THREE.Float32BufferAttribute(
			mesh.geometry.attributes.uv.array, 2
		)
	)
}

const scene = new THREE.Scene();

const loaderManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loaderManager);
const door_colorTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/color.jpg', () => { door_colorTexture.colorSpace = THREE.SRGBColorSpace });
const door_lphaTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/alpha.jpg');
const door_ambientOcclusionTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/ambientOcclusion.jpg');
const door_heightTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/height.jpg');
const door_metalnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/metalness.jpg');

```

