---
title: "花 - Three.js 案例讲解"
description: "花：Scene / Camera / Renderer 渲染管线、ShaderMaterial / RawShaderMaterial 自定义 GLSL、Cesium Primitive 层海量渲染（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,flowerShader,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 花

*Flower Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowerShader)

![花](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/flowerShader.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- ShaderMaterial / RawShaderMaterial 自定义 GLSL
- Cesium Primitive 层海量渲染
- 动画与时间线
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。
- **BillboardCollection / Primitive** 合批渲染，适合万级点面。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 定义 uniforms，在 rAF 中更新并 render
3. scene.primitives.add(collection)
4. mixer.update(delta) 或 gsap.to 驱动属性
5. gui.add 绑定可调参数

## 代码要点

```js
_height= window.innerHeight;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 5, 15);
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,0,10);
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 5, 15);
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(35, _width/_height, 1, 1000);
  camera.position.set(0,0,10);
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(_width, _height);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/flowerShader.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=flowerShader) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[浮雕图像](/examples/three/shader/reliefImage)
- 下一篇：[溶解动画](/examples/three/shader/dissolveAnimate)

> 着色器 · Three.js · 54/89
