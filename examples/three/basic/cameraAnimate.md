---
title: "相机动画 - Three.js 案例讲解"
description: "本案例展示 **相机动画** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,basic,相机动画"
outline: deep
---
# 相机动画

*Camera Animate*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cameraAnimate)

![相机动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/cameraAnimate.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 相机交互控制器
- 天空盒与环境贴图
- GSAP / anime.js 属性动画
- requestAnimationFrame 渲染循环

## 效果说明

本案例展示 **相机动画** 的实现。涉及：glTF/FBX/OBJ 外部模型加载、相机交互控制器、天空盒与环境贴图。

> 基础案例 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- 时间线库驱动 position/rotation/uniform，与 rAF 渲染循环配合。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(20, 40, 60)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

new GLTFLoader().load(FILE_HOST + 'models/glb/daodan.glb', gltf => {

  gltf.scene.traverse(child => {

    if (child.isMesh) {

      child.material.envMap = textureCube

    }

  })

  scene.add(gltf.scene)

})

const gui = new GUI()

let shakeAnimation;

const t = { type: 'camera' }

gui.add(t, 'type', ['camera', 'target']).name('类型');

gui.add({
  fn: () => {

    let c = t.type === 'camera' ? camera.position : controls.target;

    // 镜头无限慢慢抖动
    const shakeIntensity = 6;
    const shakeDuration = 0.3;
    const shake = () => {
      const originalPosition = c.clone();
      shakeAnimation = gsap.timeline({ repeat: -1, yoyo: true });
      shakeAnimation.to(c, {
        x: originalPosition.x + (Math.random() - 0.5) * shakeIntensity,
        y: originalPosition.y + (Math.random() - 0.5) * shakeIntensity,
        z: originalPosition.z + (Math.random() - 0.5) * shakeIntensity,
        duration: shakeDuration,
        ease: 'power1.inOut'
      });
    };

    shake();

  }
}, 'fn').name('目标抖动');

gui.add({
  fn: () => {
    // 停止镜头抖动
    if (shakeAnimation) {
      shakeAnimation.kill();
      shakeAnimation = null;
    }
  }
}, 'fn').name('停止抖动');

// 
gui.add({
  fn: () => {
    const c = camera.position;
    const t = controls.target;
    const jumpHeight = 50;
    const jumpDuration = 0.5;
    const jump = () => {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=cameraAnimate) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [基础案例目录](/examples/three/basic/)

> 基础案例 · Three.js
