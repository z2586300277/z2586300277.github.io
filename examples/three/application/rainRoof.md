---
title: "下雨效果 - Three.js 案例讲解"
description: "下雨效果：Scene / Camera / Renderer 渲染管线、相机交互控制器、onBeforeCompile 修改内置材质 shader（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,rainRoof,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 下雨效果

*Rain Roof*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=rainRoof)

![下雨效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/rainRoof.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- onBeforeCompile 修改内置材质 shader
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 替换 `#include <begin_vertex>` 等 chunk 注入特效，适合 PBR 材质叠加大屏效果。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. material.onBeforeCompile 注入 GLSL 与 uniform
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
this.stencilBuffer = false;
    this.depthTexture = new THREE.DepthTexture();
    this.depthTexture.format = THREE.DepthFormat;
    this.depthTexture.type = THREE.UnsignedIntType;
    
    let hw = camParams.width * 0.5;
    let hh = camParams.height * 0.5;
    let d = camParams.depth;
    this.depthCam = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0, d);

    let d = camParams.depth;
    this.depthCam = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0, d);
    this.depthCam.layers.set(1);
    this.depthCam.position.set(0, d, 0);
    this.depthCam.lookAt(0, 0, 0);
  }
  
  update(){
    renderer.setRenderTarget(this);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/rainRoof.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=rainRoof) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[视频地板](/examples/three/application/videoFloor)
- 下一篇：[具有物理效果的卡通海面](/examples/three/application/phy,ocean)

> 应用场景 · Three.js · 51/68
