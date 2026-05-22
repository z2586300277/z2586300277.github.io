---
title: "飞线效果 - Three.js 案例讲解"
description: "飞线效果：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,flyLine,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 飞线效果

*Fly Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flyLine)

![飞线效果](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/flyLine.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. 构建几何 attribute 或 instanceMatrix 并 add 到 scene

## 代码要点

```js
function initRender() {
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);

    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-200, 250, 350);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/flyLine.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flyLine) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[贴图飞线](/examples/three/application/flowLine)
- 下一篇：[管道流动](/examples/three/application/pipeFlow)

> 应用场景 · Three.js · 7/68
