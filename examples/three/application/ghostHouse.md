---
title: "鬼屋 - Three.js 案例讲解"
description: "鬼屋：Scene / Camera / Renderer 渲染管线、相机交互控制器、GUI 参数调试面板（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,ghostHouse"
outline: deep
---

# 鬼屋

*Ghost House*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=ghostHouse)

![鬼屋](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/ghostHouse.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. gui.add 绑定可调参数

## 代码要点

```js
mesh.geometry.setAttribute('uv2',
		new THREE.Float32BufferAttribute(
			mesh.geometry.attributes.uv.array, 2
		)
	)
}

const scene = new THREE.Scene();



const scene = new THREE.Scene();

const loaderManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loaderManager);
const door_colorTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/color.jpg', () => { door_colorTexture.colorSpace = THREE.SRGBColorSpace });
const door_lphaTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/alpha.jpg');
const door_ambientOcclusionTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/ambientOcclusion.jpg');
const door_heightTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/height.jpg');
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/ghostHouse.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=ghostHouse) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[代码云](/examples/three/application/codeCloud)
- 下一篇：[Canvas贴图](/examples/three/application/canvasTexture)

> 应用场景 · Three.js · 4/68
