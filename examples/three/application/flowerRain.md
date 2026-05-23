---
title: "花瓣雨 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,花瓣雨"
outline: deep
---
# 花瓣雨

*Flower Rain*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=flowerRain)

![花瓣雨](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/flowerRain.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 业务向场景组合。

> 应用场景 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 代码要点

- **`create()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
    var flowerTexture5 = new THREE.TextureLoader().load(FILE_HOST + "examples/flowerAndHouse/img/flower5.png");
    var imageList = [flowerTexture1, flowerTexture2, flowerTexture3, flowerTexture4, flowerTexture5];

    for (let i = 0; i < 400; i++) {
        var spriteMaterial = new THREE.SpriteMaterial({
            map: imageList[Math.floor(Math.random() * imageList.length)],//设置精灵纹理贴图
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        petal.add(sprite);

        sprite.scale.set(40, 50, 1); 
        sprite.position.set(2000 * (Math.random() - 0.5), 500 * Math.random(), 2000 * (Math.random() - 0.5))
    }
    scene.add(petal)
}

function render() {
    petal.children.forEach(sprite => {
        sprite.position.y -= 5;
        sprite.position.x += 0.5;
        if (sprite.position.y < - height / 2) {
            sprite.position.y = height / 2;
        }
        if (sprite.position.x > 1000) {
            sprite.position.x = -1000
        }
    });

    renderer.render(scene, camera)

    requestAnimationFrame(render)
}

create()
render()

const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=application&id=flowerRain) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
