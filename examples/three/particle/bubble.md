---
title: "粒子泡泡 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Bubble`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子泡泡"
outline: deep
---
# 粒子泡泡

*Bubble*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=bubble)

![粒子泡泡](https://z2586300277.github.io/3d-file-server/images/four/bubble.png)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Bubble`。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`addMesh()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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

    set speed(speed) {
        this._speed = speed;
        this.uniforms.speed.value = speed;
    }

    set size(size) {
        this._size = size;
        this.uniforms.size.value = size;
    }

    set color(color) {
        this._color = color;
        this.uniforms.color.value = new Color(color);
    }

    get radius() {
        return this._radius;
    }

    get emitter() {
        return this._emitter;
    }

    get emitters() {
        return this._emitters;
    }

    get count() { return this._count; }

    get speed() { return this._speed; }

    get size() { return this._size; }

    get maxHeight() { return this._maxHeight; }

    vertexShader = `
varying vec2 vUv;     //创建uv变量,用于给片元着色器传递uv
uniform float u_time; //从前端接收u_time
uniform float speed;  //从前端接收speed
uniform float size;   //从前端接收size
uniform float emitter;//发射器类型
uniform float maxHeight;//从前端接收maxHeight
attribute float data1;
attribute float data2;
void main(){
    
    //从顶点着色器取uv给片元着色器
    vUv = vec2(uv.x,uv.y);
    
    //用一个变量复制当前位置,用于计算最终位置
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=bubble) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
