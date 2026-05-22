---
title: "多视图 - Three.js 案例讲解"
description: "多视图：Scene / Camera / Renderer 渲染管线、相机交互控制器、外部模型 / 3D Tiles 加载（扩展功能）"
head:
  - - meta
    - name: keywords
      content: "three.js,expand,multViews"
outline: deep
---

# 多视图

*Mult Views*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=multViews)

![多视图](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/multViews.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 外部模型 / 3D Tiles 加载
- EffectComposer 后处理管线
- 动画与时间线

## 效果说明

Three.js WebGL 场景，加载外部模型。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- 异步 Loader 返回 scene 或 tileset；注意 scale、坐标系与 `modelMatrix` 贴地。
- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. Loader 加载资源并加入 scene / entities / primitives
4. composer.addPass 串联后处理
5. mixer.update(delta) 或 gsap.to 驱动属性

## 代码要点

```js
const box = document.getElementById('box')
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

// 视口尺寸计算（主视口占 65%，下方三个子视口各占 35%/3）
const layout = () => {


const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

// 视口尺寸计算（主视口占 65%，下方三个子视口各占 35%/3）
const layout = () => {
    const W = box.clientWidth, H = box.clientHeight
    const subH = Math.floor(H * 0.35)

    c.addPass(new RenderPass(scene, cam))
    c.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0, 0))
    c.setSize(w, h)
    return c
}

// 主相机（透视）
const { W: W0, mainH: mainH0, subH: subH0, subW: subW0 } = layout()
const camera = new THREE.PerspectiveCamera(75, W0 / mainH0, 0.1, 1000)
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/expand/multViews.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=multViews) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[D3 svg与Three](/examples/three/expand/d3Svg)


> 扩展功能 · Three.js · 19/19
