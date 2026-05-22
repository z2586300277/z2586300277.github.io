---
title: "多轮廓光 - Three.js 案例讲解"
description: "多个 OutlinePass 链式叠加，不同 selectedObjects 不同描边颜色"
head:
  - - meta
    - name: keywords
      content: "three.js,OutlinePass,多选,轮廓光"
outline: deep
---

# 多轮廓光

*Multi Outline*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=multOutlinePass)

## 你将学到什么

- 一条 composer 链上 **多个 OutlinePass**
- 每个 Pass 独立 **selectedObjects** 与 **visibleEdgeColor**
- 锥体红边、立方体默认、球体蓝边

## 效果说明

三个 primitive 各自由一个 OutlinePass 负责描边，最后 **OutputPass** 输出。

```js
outlinePass.selectedObjects = [cone];      // 红
outputPass2.selectedObjects = [cube];
outlinePass3.selectedObjects = [sphere]; // 蓝
```

## 小结

- 多类型选中高亮 = 多 OutlinePass 或自定义 shader
- 上一篇：[场景剪切](/examples/three/basic/sceneScissor) · 下一篇：[渲染器配置](/examples/three/basic/effectComposer)

> 基础案例 · Three.js · 31/35
