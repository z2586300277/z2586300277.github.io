---
title: "WiFi - Three.js 案例讲解"
description: "WiFi：Scene / Camera / Renderer 渲染管线、相机交互控制器、onBeforeCompile 修改内置材质 shader（着色器）"
head:
  - - meta
    - name: keywords
      content: "three.js,shader,wifiShader,顶点着色器,uniform 驱动,BufferGeometry"
outline: deep
---

# WiFi

*WiFi Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=wifiShader)

![WiFi](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/wifiShader.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- onBeforeCompile 修改内置材质 shader
- 粒子 / 点云 / 实例化渲染

## 效果说明

Three.js WebGL 场景，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、uniform 驱动、BufferGeometry。打开在线案例可查看最终画面。

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
const gs = offsets.map((offset, idx) => {
			const g = new THREE.PlaneGeometry(1, 0.125, segs, 1).translate(0, offset, 0);
			const count = g.attributes.position.count;
			const ts = Math.random() * 2;
			g.setAttribute("batchIndex", new THREE.Float32BufferAttribute(new Array(count).fill(idx), 1));
			return g;
		});
		const g = mergeGeometries(gs);
		g.setAttribute(

			const ts = Math.random() * 2;
			g.setAttribute("batchIndex", new THREE.Float32BufferAttribute(new Array(count).fill(idx), 1));
			return g;
		});
		const g = mergeGeometries(gs);
		g.setAttribute(
			"timeShift",
			new THREE.InstancedBufferAttribute(
				new Float32Array(Array.from({ length: amount }, () => Math.random() * 2)),
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/shader/wifiShader.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=wifiShader) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[火焰材质](/examples/three/shader/fireMaterial)
- 下一篇：[建筑渐变](/examples/three/shader/buildGradient)

> 着色器 · Three.js · 85/89
