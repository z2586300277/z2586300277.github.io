---
title: "矩阵操作 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `init`、`generateMatrix`。"
head:
  - - meta
    - name: keywords
      content: "three.js,矩阵操作"
outline: deep
---

# 矩阵操作

*Matrix Oper*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=matrixOperation)


![矩阵操作](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/matrixOperation.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `init`、`generateMatrix`。

> 应用场景 · Three.js

## 实现思路

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 补间动画交给 GSAP/anime/Tween，别在 rAF 里手搓 easing。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `normalizationTo3()` — 移除 Entity / 解绑监听
- `transform()` — 移除 Entity / 解绑监听
- `animate()` — rAF：update controls + render
- `render()` — renderer.render(scene, camera)

## 源码

```js
<html>

<head>
    <meta charset="UTF-8">
    <title>threejs-example 1-model</title>
    <script type="importmap">
        {
          "imports": {
            "three": "https://threejs.org/build/three.module.js",
            "three/addons/": "https://threejs.org/examples/jsm/"
          }
        }
      </script>
      <script>
        
      </script>
    <style>
        body {
            margin: 0;
            background-color: black;
        }

        a {
            color: #8ff;
        }

        .element {
            width: 120px;
            height: 120px;
            box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
            border: 1px solid rgba(127, 255, 255, 0.25);
            font-family: Helvetica, sans-serif;
            text-align: center;
            line-height: normal;
            cursor: default;
        }

        .element-active {
            background-color: rgba(255, 145, 0, 0.582) !important;
        }

        .element:hover {
            box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
            border: 1px solid rgba(127, 255, 255, 0.75);
        }

        .element .symbol {
            position: absolute;
            top: 30px;
            left: 0px;
            right: 0px;
            font-size: 40px;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.75);
      
```

