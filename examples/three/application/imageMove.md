---
title: "图片移动 - Three.js 案例讲解"
description: "图片移动：Scene / Camera / Renderer 渲染管线、onBeforeCompile 修改内置材质 shader（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,imageMove,顶点着色器,片元着色器"
outline: deep
---

# 图片移动

*Image Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=imageMove)

![图片移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/imageMove.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- onBeforeCompile 修改内置材质 shader

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- 替换 `#include <begin_vertex>` 等 chunk 注入特效，适合 PBR 材质叠加大屏效果。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. material.onBeforeCompile 注入 GLSL 与 uniform
3. 搭建灯光与环境（如有）
4. requestAnimationFrame 循环 update + render

## 代码要点

```js
const [w, h] = [innerWidth, innerHeight]
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader()


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader()
const urls = [
    FILE_HOST + 'images/wx_star.png',
    FILE_HOST + 'images/QQ.png',
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/imageMove.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=imageMove) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[风吹动画](/examples/three/application/windMove)
- 下一篇：[VR 全景视频](/examples/three/application/vrVideo)

> 应用场景 · Three.js · 36/68
