---
title: "柱状图 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `onWindowResize`、`animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,柱状图,扩展功能"
outline: deep
---

# 柱状图

*Bar Charts*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=barCharts)


![柱状图](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/barCharts.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `onWindowResize`、`animate`。

> 扩展功能 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 代码结构

- 坐标轴标签：清爽灰色，无干扰
- 轴名称标签 (ECharts 风格：加粗，深色)
- 柱顶数值标签：醒目红褐色，类似ECharts 强调
- 简单辅助：去掉滚动条，干净视图

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <title>Three.js 柱状图 · ECharts 标准风格</title>
    <style>
        body {
            margin: 0;
            overflow: hidden;
            font-family: "Microsoft YaHei", sans-serif;
        }

        canvas {
            display: block;
        }
```

### 坐标轴标签：清爽灰色，无干扰

```js
.axis-tick-label {
            color: #4a4a4a;
            font-size: 13px;
            font-weight: normal;
            white-space: nowrap;
            pointer-events: none;
            text-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
        }
```

### 轴名称标签 (ECharts 风格：加粗，深色)

```js
.axis-name-label {
            color: #2c3e50;
            font-size: 16px;
            font-weight: 600;
            white-space: nowrap;
            pointer-events: none;
            text-shadow: 0 0 3px rgba(255, 255, 255, 0.9);
        }
```

