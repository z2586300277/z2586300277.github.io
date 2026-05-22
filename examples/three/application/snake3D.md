---
title: "3D贪吃蛇 - Three.js 案例讲解"
description: "大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `init`、`createDiatoms`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,3D贪吃蛇,应用场景"
outline: deep
---

# 3D贪吃蛇

*Snake 3D*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=snake3D)


![3D贪吃蛇](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/snake3D.jpg)


## 效果说明

大量重复物体或粒子，注意 draw call 与 update 频率。主流程在 `init`、`createDiatoms`。

> 应用场景 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 分数显示
- 小地图 - 正方形
- 高度等于宽度
- 高度指示器

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `createDiatoms()` — 材质 / GLSL
- `createSegmentedWorms()` — 材质 / GLSL

## 源码

```js
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
    <title>3D贪吃蛇：浮游世界大冒险 - 第一人称模式</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            touch-action: none;
            user-select: none;
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0c1e3a, #0a1429);
            color: #e6f7ff;
            min-height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .game-container {
            display: flex;
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        
        #gameCanvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
```

### 分数显示

```js
#scoreDisplay {
            position: absolute;
            top: 1.5%;
            left: 1.5%;
            background: rgba(10, 25, 50, 0.8);
            padding: 1.2vh 1vw;
            border-radius: 2.5vh;
            font-size: calc(12px + 0.8vw);
            font-weight: bold;
            color: #00ffcc;
            z-index: 5;
            box-shadow: 0 0.5vh 1.5vh rgba(0, 0, 0, 0.6);
            border: 0.2vh solid rgba(0, 200, 255, 0.4);
            backdrop-filter: blur(8px);
            min-width: 80px;
            min-height: 4vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
```

### 小地图 - 正方形

```js
.mini-map-container {
            position: absolute;
            bottom: 11vh; 
            right: 10%; 
            width: 18vw;
            min-width: 100px;
            max-width: 300px;
            min-height: 100px;
            max-height: 300px;
            padding-top: 18vw;
```

