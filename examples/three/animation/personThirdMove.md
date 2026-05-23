---
title: "第三人称移动 - Three.js 案例讲解"
description: "Three.js 关键帧或补间动画。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,animation,第三人称移动"
outline: deep
---
# 第三人称移动

*Third Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=personThirdMove)

![第三人称移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/animation/personThirdMove.jpg)

## 你将学到什么

- AnimationMixer 骨骼动画播放与过渡
- glTF/FBX/OBJ 外部模型加载
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

Three.js 关键帧或补间动画。

> 动画效果 · Three.js

## 核心概念

- **AnimationMixer** 驱动 glTF 骨骼动画；每帧 `mixer.update(delta)`。动作切换可用 `crossFadeTo` 平滑过渡。

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 代码要点

- **`update()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
const keys = { w: false, s: false, a: false, d: false };
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function update() {

  if (!character) return

  if (keys.a) character.rotation.y += turnSpeed;
  if (keys.d) character.rotation.y -= turnSpeed;
  if (keys.w || keys.s) {
    const dir = new THREE.Vector3();
    character.getWorldDirection(dir);
    character.position.add(dir.multiplyScalar(keys.w ? moveSpeed : -moveSpeed));
  }
  character.mixerUpdate()

  const targetPos = character.position.clone().add(cameraOffset.clone().applyQuaternion(character.quaternion));
  camera.position.lerp(targetPos, smoothFactor);
  camera.lookAt(character.position.clone().add(new THREE.Vector3(0, 1, 0)));

}

// 动画循环
animate();
function animate() {

  update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

}

// 窗口自适应
window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

})

GLOBAL_CONFIG.ElMessage('键盘事件：WASD移动')
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=animation&id=personThirdMove) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [动画效果目录](/examples/three/animation/)

> 动画效果 · Three.js
