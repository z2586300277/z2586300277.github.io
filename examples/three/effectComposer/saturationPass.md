---
title: "饱和度(自定义Pass) - Three.js 案例讲解"
description: "饱和度(自定义Pass)：Scene / Camera / Renderer 渲染管线、相机交互控制器、ShaderMaterial / RawShaderMaterial 自定义 GLSL（后期处理）"
head:
  - - meta
    - name: keywords
      content: "three.js,effectComposer,saturationPass,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 饱和度(自定义Pass)

*Saturation*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=effectComposer&id=saturationPass)

![饱和度(自定义Pass)](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/saturationPass.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- EffectComposer 后处理管线
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. 定义 uniforms，在 rAF 中更新并 render
4. composer.addPass 串联后处理
5. gui.add 绑定可调参数

## 代码要点

```js
function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.add(new THREE.PointLight(0xffffff, 1, 1000, 0.01));
    camera.position.set(10, 10, 10);

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.add(new THREE.PointLight(0xffffff, 1, 1000, 0.01));
    camera.position.set(10, 10, 10);
    scene.add(camera);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/effectComposer/saturationPass.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=effectComposer&id=saturationPass) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[模糊反射(drei转原生)](/examples/three/effectComposer/blurReflect)
- 下一篇：[边缘模糊效果](/examples/three/effectComposer/EdgeBlurringEffect)

> 后期处理 · Three.js · 6/10
