---
title: "粒子线条 - Three.js 案例讲解"
description: "粒子线条：Scene / Camera / Renderer 渲染管线、相机交互控制器、EffectComposer 后处理管线（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,particleLine,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 粒子线条

*Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleLine)

![粒子线条](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleLine.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- EffectComposer 后处理管线
- 粒子 / 点云 / 实例化渲染
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. composer.addPass 串联后处理
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
5. gui.add 绑定可调参数

## 代码要点

```js
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1200;
  scene.fog = new THREE.Fog( 0x000000, 10, 2000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);


  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1200;
  scene.fog = new THREE.Fog( 0x000000, 10, 2000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/particleLine.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleLine) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[波浪粒子](/examples/three/particle/waveParticleShader)
- 下一篇：[球体线条](/examples/three/particle/sphereLine)

> 粒子 · Three.js · 11/27
