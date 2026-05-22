---
title: "鬼屋 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,鬼屋"
outline: deep
---
# 鬼屋

*Ghost House*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=ghostHouse)

![鬼屋](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/ghostHouse.jpg)

## 你将学到什么

- 相机交互控制器
- 实时阴影 ShadowMap
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- GUI 面板调试参数

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

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
const door_normalTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/normal.jpg');
const door_roughnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/roughness.jpg');

const bricks_colorTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/color.jpg', () => { bricks_colorTexture.colorSpace = THREE.SRGBColorSpace });
const bricks_ambientOcclusionTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/ambientOcclusion.jpg');
const bricks_normalTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/normal.jpg');
const bricks_roughnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/roughness.jpg');

const grass_colorTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/color.jpg', () => { grass_colorTexture.colorSpace = THREE.SRGBColorSpace });
const grass_ambientOcclusionTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/ambientOcclusion.jpg');
const grass_normalTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/normal.jpg');
const grass_roughnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/roughness.jpg');
loaderManager.onLoad = function () {
	console.log('纹理加载完毕')
}
loaderManager.onError = function (e) {
	console.log('纹理失败', e)
}
/**
 * Fog
 */
const fog = new THREE.Fog('#50508b', 1, 15);
scene.fog = fog;

/**
 * Objects
 */
const houseObj = {
	houseWidth: 4,
	houseHeight: 2.5,
	houseDepth: 4,
	roofHeight: 0.8,
	doorSize: 2.2
}

const house = new THREE.Group();
scene.add(house);

//房屋墙壁
const wall = new THREE.Mesh(
	new THREE.BoxGeometry(houseObj.houseWidth, houseObj.houseHeight, houseObj.houseDepth),
	new THREE.MeshStandardMaterial({
		map: bricks_colorTexture,
		aoMap: bricks_ambientOcclusionTexture,
		aoMapIntensity: 2,
		normalMap: bricks_normalTexture,
		roughnessMap: bricks_roughnessTexture,
	})
)
setAoMapEnable(wall);
wall.position.y = houseObj.houseHeight * 0.5
house.add(wall)

const roof = new THREE.Mesh(
	new THREE.ConeGeometry(
		Math.sqrt(houseObj.houseWidth * houseObj.houseWidth + houseObj.houseDepth * houseObj.houseDepth) * 0.5,
		houseObj.roofHeight,
		4),
	new THREE.MeshStandardMaterial(
		{
			color: '#b35f45'
		}
	)
)
roof.rotation.y = Math.PI / 4;
roof.position.y = houseObj.houseHeight + 0.5 * houseObj.roofHeight
roof.geometry.scale(1.5, 1.5, 1.5)
console.log('roof', roof);
house.add(roof);

// 门
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(houseObj.doorSize, houseObj.doorSize, 100, 100),
	new THREE.MeshStandardMaterial({
		map: door_colorTexture,
		transparent: true,
		alphaMap: door_lphaTexture,
		aoMap: door_ambientOcclusionTexture,
		aoMapIntensity: 5,
		displacementMap: door_heightTexture,
		displacementScale: 0.1,
		normalMap: door_normalTexture,
		metalnessMap: door_metalnessTexture,
		roughness: door_roughnessTexture
	})
)
door.geometry.setAttribute('uv2',
	new THREE.Float32BufferAttribute(
		door.geometry.attributes.uv.array, 2
	)
)
door.position.y = 1;
door.position.z = houseObj.houseDepth * 0.5 + 0.01;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=ghostHouse) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
