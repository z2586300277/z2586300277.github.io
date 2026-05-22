---
title: "WiFi - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,WiFi,着色器"
outline: deep
---

# WiFi

*WiFi Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=wifiShader)


![WiFi](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/wifiShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 实现思路

- 大量重复物体用 `InstancedMesh`，一次 draw call；矩阵写 `setMatrixAt`。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

class RadioSignals extends THREE.InstancedMesh {
	constructor(gu, camera, amount, colors = []) {
		const segs = 36;
		const offsets = [0.0625, 0.25 + 0.1875, 0.5 + 0.1875, 0.75 + 0.1875];
		const gs = offsets.map((offset, idx) => {
			const g = new THREE.PlaneGeometry(1, 0.125, segs, 1).translate(0, offset, 0);
			const count = g.attributes.position.count;
			const ts = Math.random() * 2;
			g.setAttribute("batchIndex", new THREE.Float32BufferAttribute(new Array(count).fill(idx), 1));
			return g;
		});
		const g = mergeGeometries(gs);
		g.setAttribute(
			"timeShift",
			new THREE.InstancedBufferAttribute(
				new Float32Array(Array.from({ length: amount }, () => Math.random() * 2)),
				1
			)
		);
		const material = new THREE.MeshBasicMaterial({
			onBeforeCompile: shader => {
				shader.uniforms.time = gu.time;
				shader.uniforms.bendAngle = this.uniforms.bendAngle;
				shader.vertexShader = `
                uniform float time;
                uniform float bendAngle;
                attribute float batchIndex;
                attribute float timeShift;
                mat2 rot(float a){
                float c = cos(a);
                float s = sin(a);
```

