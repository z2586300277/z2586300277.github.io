---
title: "点星感谢 - Three.js 案例讲解"
description: "点星感谢：Scene / Camera / Renderer 渲染管线、ShaderMaterial / RawShaderMaterial 自定义 GLSL（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,textStarShader,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 点星感谢

*Text Star*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=textStarShader)

![点星感谢](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/textStarShader.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- ShaderMaterial / RawShaderMaterial 自定义 GLSL

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 定义 uniforms，在 rAF 中更新并 render
3. 搭建灯光与环境（如有）
4. requestAnimationFrame 循环 update + render

## 代码要点

```js
camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(100, 400, 600);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    let geometry = new TextGeometry(text, {
        font: font,


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    let geometry = new TextGeometry(text, {
        font: font,
        size: 30,
        depth: 5,
        curveSegments: 3,

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    let geometry = new TextGeometry(text, {
        font: font,
        size: 30,
        depth: 5,
        curveSegments: 3,
        bevelThickness: 2,
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/textStarShader.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=textStarShader) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[警告信息](/examples/three/shader/warnInfo)
- 下一篇：[智慧城市扫光](/examples/three/shader/cityMoveLight)

> 着色器 · Three.js · 19/89
