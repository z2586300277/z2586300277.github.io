---
title: "管道流动 - Three.js 案例讲解"
description: "管道流动：Scene / Camera / Renderer 渲染管线、相机交互控制器、动画与时间线（应用场景）"
head:
  - - meta
    - name: keywords
      content: "three.js,application,pipeFlow"
outline: deep
---

# 管道流动

*Pipe Flow*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=pipeFlow)

![管道流动](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/pipeFlow.jpg)

## 你将学到什么

- Scene / Camera / Renderer 渲染管线
- 相机交互控制器
- 动画与时间线
- GUI 参数调试面板

## 效果说明

Three.js WebGL 场景。打开在线案例可查看最终画面。

## 核心概念

- **Scene** 容纳对象，**Camera** 定义视点，**WebGLRenderer** 输出 canvas。
- **OrbitControls** 轨道旋转缩放；开启阻尼时每帧 `controls.update()`。
- **AnimationMixer** 播 glTF 动画；**GSAP** 补间任意属性。
- dat.GUI / lil-gui 绑定 uniform 或配置对象实时调参。

## 实现步骤

1. 初始化 Viewer 或 Scene / Camera / Renderer
2. 创建 OrbitControls 并处理 resize
3. mixer.update(delta) 或 gsap.to 驱动属性
4. gui.add 绑定可调参数

## 代码要点

```js
// 获取模型的包围盒
        const box = new THREE.Box3().setFromObject(this)

        return {
            minX: box.min.x,
            maxX: box.max.x,
            minY: box.min.y,
            maxY: box.max.y,
            minZ: box.min.z,

            tubularSegments: 100,
            curve: new THREE.CatmullRomCurve3(),
        };
        const finalOptions = Object.assign({}, defaultOptions, options);
        const flowTexture = new THREE.TextureLoader().load(FILE_HOST + "threeExamples/application/flow.png");
        flowTexture.colorSpace = THREE.SRGBColorSpace;
        flowTexture.wrapS = flowTexture.wrapT = THREE.RepeatWrapping;
        // finalOptions.curve.getLength() / 1000 获取管道总长度 / 1000, 是贴图横向重复次数, 以确保每条管道贴图样式相同
        flowTexture.repeat.set(finalOptions.curve.getLength() / 1000, 1);
```


完整源码：[GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/threeExamples/application/pipeFlow.js)

## 小结

- 建议先在 [在线案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=pipeFlow) 运行，再对照源码修改 uniform / 参数加深理解


- 上一篇：[飞线效果](/examples/three/application/flyLine)
- 下一篇：[建筑线条](/examples/three/application/buildingLine)

> 应用场景 · Three.js · 8/68
