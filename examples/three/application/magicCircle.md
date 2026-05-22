---
title: "魔法阵 - Three.js 案例讲解"
description: "魔法阵：Scene / Camera / Renderer 渲染管线、相机交互控制器、粒子 / 点云 / 实例化渲染（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,magicCircle,BufferGeometry"
outline: deep
---

# 魔法阵

*Magic Circle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=magicCircle)

![魔法阵](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/magicCircle.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，粒子或点云特效，技术点：BufferGeometry。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
this.options = options;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.animates = {};
        const k = dom.clientWidth / dom.clientHeight;
        if ("fov" in options.cameraOptions) {
            this.defaultCamera = new THREE.PerspectiveCamera(options.cameraOptions.fov, k, options.cameraOptions.near, options.cameraOptions.far);
        }
        else {

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.animates = {};
        const k = dom.clientWidth / dom.clientHeight;
        if ("fov" in options.cameraOptions) {
            this.defaultCamera = new THREE.PerspectiveCamera(options.cameraOptions.fov, k, options.cameraOptions.near, options.cameraOptions.far);
        }
        else {
            const s = options.cameraOptions.s;
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/magicCircle.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=magicCircle) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[优雅永不过时](/examples/three/application/z2586300277)
- 下一篇：[代码云](/examples/three/application/codeCloud)

> 应用场景 · Three.js · 2/68
