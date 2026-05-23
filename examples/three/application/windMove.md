---
title: "风吹动画 - Three.js 案例讲解"
description: "风吹动画：Scene / Camera / Renderer 渲染管线、相机交互控制器、外部模型 / 3D Tiles 加载（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,windMove,顶点着色器,片元着色器,uniform 驱动"
outline: deep
---

# 风吹动画

*Wind Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=windMove)

![风吹动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/windMove.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- ShaderMaterial / RawShaderMaterial 自定义 GLSL

## 效果说明

Three.js WebGL 场景，加载外部模型，以自定义 shader 呈现核心视觉效果，技术点：顶点着色器、片元着色器、uniform 驱动。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **ShaderMaterial** 自定义 uniforms + vertex/fragment；**RawShaderMaterial** 需手写全部 shader 声明。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. 定义 uniforms，在 rAF 中更新并 render

## 代码要点

```js
main() {
        const vertexShader = `
				varying vec2 vUv;

				void main() {
				vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
				`;


        const fragmentShader = `
				varying vec2 vUv;

				uniform float uTime;

				void main() {
				float len = 0.15;
				float falloff = 0.1;


                points.push(new THREE.Vector3(
                    r * Math.sin(a),
                    Math.pow(p, 2.5) * 6,
                    r * Math.cos(a)
                ));
            }
            return points;
        }
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/windMove.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=windMove) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[新年快乐](/examples/three/application/happyNewYear)
- 下一篇：[图片移动](/examples/three/application/imageMove)

> 应用场景 · Three.js · 35/68
