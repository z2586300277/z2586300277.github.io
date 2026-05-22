---
title: "粒子火焰 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `randomFloat`、`partToHex`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,粒子火焰,粒子"
outline: deep
---

# 粒子火焰

*Fire Particles*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=fireParticles)


![粒子火焰](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/fireParticles.jpg)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `randomFloat`、`partToHex`。

> 粒子 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var camera, renderer, scene, particleSystem, baseParticle, mouse;
mouse = [window.innerWidth / 2, window.innerHeight / 2];
renderer = new THREE.WebGLRenderer({ antialias: true });
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);

baseParticle = new THREE.BoxGeometry(0.4, 0.4, 0.4);
baseParticle.rotateZ(Math.PI / 4);

baseParticle = new THREE.Mesh(
	baseParticle,
	new THREE.MeshBasicMaterial({ color: 0xffffff })
);

particleSystem = new ParticleSystem(99);
render();

function randomFloat(a, b) {
	var r = (Math.random() * (b - a) + a);
	return r;
}

function partToHex(part) {
	var h = part.toString(16);
	return h.length == 1 ? "0" + h : h;
}

var color;
function FireParticle() {
	this.direction;
	this.scaleSpeed;
	this.curAge;

	this.parent;

	this.obj;
	this.colorRamp = [[255, 255, 0], [255, 136, 34], [255, 17, 68], [153, 136, 136]];

	this.update = function () {
		if (Math.abs(this.parent.pos.x - this.obj.position.x) > 10 || Math.abs(-this.parent.pos.y - this.obj.position.y) > 10)
```

