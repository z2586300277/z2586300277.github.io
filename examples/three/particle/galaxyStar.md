---
title: "星系 - Three.js 案例讲解"
description: "星系：Scene / Camera / Renderer 渲染管线、相机交互控制器、粒子 / 点云 / 实例化渲染（粒子）"
head:
  - - meta
    - name: keywords
      content: "three.js,particle,galaxyStar,BufferGeometry"
outline: deep
---

# 星系

*Galaxy Star*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=galaxyStar)

![星系](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/galaxyStar.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 粒子 / 点云 / 实例化渲染
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，粒子或点云特效，技术点：BufferGeometry。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
4. gui.add 绑定可调参数

## 代码要点

```js
// Create scene
  const scene = new THREE.Scene();

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 110;


  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  root.appendChild(renderer.domElement);

  const onWindowResize = () => {
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/particle/galaxyStar.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=particle&id=galaxyStar) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[下雪](/examples/three/particle/downSnow)
- 下一篇：[粒子地球](/examples/three/particle/pointsEarth)

> 粒子 · Three.js · 8/27
