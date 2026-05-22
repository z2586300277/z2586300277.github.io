---
title: "飞线效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initRender`、`initCamera`。"
head:
  - - meta
    - name: keywords
      content: "three.js,飞线效果"
outline: deep
---

# 飞线效果

*Fly Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flyLine)


![飞线效果](https://z2586300277.github.io/3d-file-server/threeExamples/application/flyLine/colorful.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initRender`、`initCamera`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `addglobe()` — 材质 / GLSL
- `createMaterial()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';

var renderer,clock,scene,camera;
    
function initRender() {
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-200, 250, 350);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function initScene() {
    scene = new THREE.Scene();

}

function initLight() {
    var hemisphereLight1 = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    hemisphereLight1.position.set(0, 200, 0);
    scene.add(hemisphereLight1);
}

var linegroup = [];
function addflyline(minx,maxx,colorf,colort){
    var colorf = colorf||{
        r:0.0,
        g:0.0,
        b:0.0
    };
    var colort = colort||{
        r:1.0,
        g:1.0,
        b:1.0
    };
    var curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3( minx, 0, minx ),
        new THREE.Vector3( minx/2, maxx % 70 + 100, maxx/2 ),
        new THREE.Vector3( maxx/2, maxx % 70 + 70, maxx/2 ),
        new THREE.
```

