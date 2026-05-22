---
title: "残影效果 - Three.js 案例讲解"
description: "原场景 + 后期 Pass 叠加。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,残影效果"
outline: deep
---
# 残影效果

*Afterimage*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=afterimagePass)

![残影效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/afterimagePass.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

原场景 + 后期 Pass 叠加。

> 后期处理 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. EffectComposer 组装 Pass 链并 render

## 代码要点

- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js ';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000');
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// 添加光源
const directionalLight = new THREE.DirectionalLight('#fff');
directionalLight.position.set(30, 30, 30).normalize();
scene.add(directionalLight);
const ambientLight = new THREE.AmbientLight('#fff', 2);
scene.add(ambientLight);

// 添加性能监控
const stats = new Stats();
document.body.appendChild(stats.dom);

scene.fog = new THREE.Fog(0x000000, 1, 1000);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(15, 0, 0)
scene.add(mesh);

new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => {

    scene.add(gltf.scene)

    gltf.scene.scale.multiplyScalar(0.1)

})

// 后期处理
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const afterimagePass = new AfterimagePass();
composer.addPass(afterimagePass);

// GUI控制
const params = {
    enable: true
};
const gui = new dat.GUI({ name: 'Damp setting' });
gui.add(afterimagePass.uniforms["damp"], 'value', 0, 1).step(0.001);
gui.add(params, 'enable');

// 窗口大小调整
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// 动画渲染
function animate() {
    requestAnimationFrame(animate);
    stats.update();
    controls.update();

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    if (params.enable) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

animate();
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=afterimagePass) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
