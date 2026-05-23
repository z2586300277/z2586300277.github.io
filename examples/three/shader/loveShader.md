---
title: "爱心 - Three.js 案例讲解"
description: "爱心：Scene / Camera / Renderer 渲染管线、ShaderMaterial / RawShaderMaterial 自定义 GLSL、粒子 / 点云 / 实例化渲染（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,loveShader,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 爱心

*Love Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=loveShader)

![爱心](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/loveShader.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- 粒子 / 点云 / 实例化渲染
- 动画与时间线

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，粒子或点云特效，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- 大量点用 **BufferGeometry + Points** 或 **InstancedMesh** 合批，避免逐 Entity 创建。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 定义 uniforms，在 rAF 中更新并 render
3. 构建几何 attribute 或 instanceMatrix 并 add 到 scene
4. mixer.update(delta) 或 gsap.to 驱动属性

## 代码要点

```js
this.clock = new THREE.Clock();
    this.animate();
    this.addUIElements();
  }
  
  // 场景初始化
  initScene() {
    this.scene = new THREE.Scene();

  initScene() {
    this.scene = new THREE.Scene();
    
    // 创建更丰富的渐变背景
    const bgColors = [new THREE.Color(0x1a0033), new THREE.Color(0x000022)];
    const bgTexture = this.createGradientTexture(bgColors);
    this.scene.background = bgTexture;
    
    // 增强光源

    // 创建更丰富的渐变背景
    const bgColors = [new THREE.Color(0x1a0033), new THREE.Color(0x000022)];
    const bgTexture = this.createGradientTexture(bgColors);
    this.scene.background = bgTexture;
    
    // 增强光源
    this.scene.add(new THREE.AmbientLight(0x404040, 1.8));
    
    this.pointLight = new THREE.PointLight(0xff3388, 1.5, 100);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/loveShader.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=loveShader) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[围栏着色器](/examples/three/shader/fenceShader)
- 下一篇：[城市混合Shader](/examples/three/shader/cityMixShader)

> 着色器 · Three.js · 13/89
