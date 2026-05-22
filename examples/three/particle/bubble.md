---
title: "粒子泡泡 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Bubble`。"
head:
  - - meta
    - name: keywords
      content: "three.js,粒子泡泡"
outline: deep
---

# 粒子泡泡

*Bubble*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=bubble)


![粒子泡泡](https://z2586300277.github.io/3d-file-server/images/four/bubble.png)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Bubble`。

> 粒子 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 类与方法

### Bubble

- `constructor()` — 参数：config

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `addMesh()` — 材质 / GLSL
- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
const {
    Color, ShaderMaterial,
    BufferGeometry, Points,
    Vector3, Float32BufferAttribute,
} = THREE

class Bubble extends Points {

    _count = 0;

    _size = 10;

    _color = "#ff0000";

    _speed = 0.8;

    _maxHeight = 10;

    _radius = 10;

    _radius2 = 10;

    isBubble = true;

    _emitter = "cone"

    _emitters = [
        "cone", "cylinder",
        "box", "sphere"
    ];

    type = "Bubble";

    /**
     *
     * @param emitter {string}
     */
    set emitter(emitter) {
        if (this._emitters.indexOf(emitter) !== -1) {
            this._emitter = emitter;
            this.setPoints();
            this.uniforms.emitter.value = this._emitters.indexOf(this._emitter);
        }
    }

    set radius(radius) {
        this._radius = radius;
        this.setPoints();
    }

    set radius2(radius) {
        this._radius2 = radius;
        this.setPoints();
    }

    set count(count) {
        this._count = count;
        this.setPoints();
    }

    set maxHeight(maxHeight) {
        this._maxHeight = maxHeight;
        this.uniforms.maxHeight.value = maxHeight || 10;
        this.setPoints();
    }

    set speed(sp
```

