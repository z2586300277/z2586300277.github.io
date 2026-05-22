---
title: "花瓣雨 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `create`、`render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,花瓣雨"
outline: deep
---

# 花瓣雨

*Flower Rain*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flowerRain)


![花瓣雨](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/flowerRain.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `create`、`render`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const box = document.getElementById('box');

const scene = new THREE.Scene();
/**
 * 花瓣分组
 */
const petal = new THREE.Group();

const width = box.clientWidth;
const height = box.clientHeight;
//窗口宽高比
const k = width / height;
//三维场景的显示的上下范围
const s = 200;
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

const renderer = new THREE.WebGLRenderer();

function create() {
    //设置相机位置
    camera.position.set(0, 200, 500)
    camera.lookAt(scene.position)

    //设置渲染区域尺寸
    renderer.setSize(width, height)
    //设置背景颜色

    //body元素中插入canvas对象
    box.appendChild(renderer.domElement)

    // const axisHelper = new THREE.AxisHelper(1000);
    // scene.add(axisHelper)

    var flowerTexture1 = new THREE.TextureLoader().load(FILE_HOST + "examples/flowerAndHouse/img/flower1.png");
    var flowerTexture2 = new THREE.TextureLoader().load(FILE_HOST + "examples/flowerAndHouse/img/flower2.png");
    var flowerTexture3 = new THREE.TextureLoader().load(FILE_HOST + "examples/flowerAndHouse/img/flower3.png");
    var flowerTexture4 = new THREE.TextureLoader().load(FILE_HOST + "examples/flowerAndHouse/img/flower4.png");
    var flowerTexture5 = new THREE.TextureLoader().load(FILE_HOST + "examples/flowerAndHouse/img/flower
```

