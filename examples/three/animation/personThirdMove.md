---
title: "第三人称移动 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。主流程在 `update`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,第三人称移动,动画效果"
outline: deep
---

# 第三人称移动

*Third Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=animation&id=personThirdMove)


![第三人称移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/personThirdMove.jpg)


## 效果说明

Three.js 关键帧或补间动画。主流程在 `update`、`animate`。

> 动画效果 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement)

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'))

const textureCube = new THREE.CubeTextureLoader().load(urls)

scene.background = textureCube

scene.add(new THREE.GridHelper(100, 40))

let character

new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => {

  character = gltf.scene
  character.traverse(i => i.isMesh && (i.material.envMap = textureCube))

  scene.add(character)
  character.scale.multiplyScalar(0.03)

  const mixer = new THREE.AnimationMixer(character) // 模型动画
  const action = mixer.clipAction(gltf.animations[1])
  const clock = new THREE.Clock()
  character.mixerUpdate = () => mixer.update(clock.getDelta())
  action.play()

})

// 相机参数
const cameraOffset = new THREE.Vector3(0, 5, -5);
const smoothFactor = 0.1;
const moveSpeed = 0.06;
const turnSpeed = 0.03;

// 移动状态
const keys = { w: false, s: false, a: false, d: fal
```

