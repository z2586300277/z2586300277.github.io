---
title: "城市线条 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `City`。"
head:
  - - meta
    - name: keywords
      content: "three.js,城市线条"
outline: deep
---

# 城市线条

*City Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=cityLine)


![城市线条](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/cityLine.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `City`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### City

- `constructor()` — 初始化成员
- `init()` — 材质 / GLSL
- `surroundLine()` — 材质 / GLSL

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform vec3 uColor;
          void main() {
            gl_FragColor = vec4(uColor, 1);
          }
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

class City {

    constructor() {
        this.fbxLoader = new FBXLoader();
        this.group = new THREE.Group();
        this.clock = new THREE.Clock()
        this.surroundLineMaterial = null;// 定义包围线材质属性
        this.time = { value: 0 };
        this.startTime = { value: 0 };
        this.startLength = { value: 2 }
        this.isStart = false;

        this.fbxLoader.load(FILE_HOST + 'models/fbx/shanghai.FBX', (group) => {

            this.group.add(group);
            group.traverse((child) => {
                // 设置城市建筑（mesh物体），材质基本颜色
                if (child.name == 'CITY_UNTRIANGULATED') {
                    const materials = Array.isArray(child.material) ? child.material : [child.material]
                    materials.forEach((material) => {
                        material.transparent = true;
                        material.color.setStyle("#9370DB");
                    })
                }

                // 设置城市地面（mesh物体），材质基本颜色
                if (child.name == 'LANDMASS') {
                    const materials = Array.isArray(child.material) ? child.material : [child.material]
                    materials.forEach((material) => {
                     
```

