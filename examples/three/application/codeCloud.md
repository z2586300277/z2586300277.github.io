---
title: "代码云 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,代码云"
outline: deep
---
# 代码云

*Code Cloud*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=codeCloud)

![代码云](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/codeCloud.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 实时阴影 ShadowMap
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`initMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`snowanimate()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

var scene, camera, renderer, clock, controller, stats
var shader_material, cloud, range = 50

init();
animate();

// - Functions -
function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(10, 10, 10)
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿处理
        alpha: true,
    });
    renderer.setClearColor(0x000000)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)

    var axisHelper = new THREE.AxesHelper(10);
    scene.add(axisHelper);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(400, 200, 300);
    // directionalLight.castShadow = true
    scene.add(directionalLight);
    // 方向光2
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight2.position.set(-400, -200, -300);
    scene.add(directionalLight2);
    //环境光
    var ambient = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambient);

    stats = new Stats()
    document.body.appendChild(stats.dom);

    // --------

    cloud = new THREE.Group()
    scene.add(cloud)
    shader_material = initMaterial()

    let width = 128, height = 128

    for (var i = 0; i < 1000; i++) {
        var pos = new THREE.Vector3(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2)

        pos.vX = ((Math.random() - 0.5) / 3) / 10
        pos.vY = (0.05 + Math.random() * 0.1) / 5

        let geometry = new THREE.PlaneGeometry(4, 4);
        let s = Math.floor(Math.random() * 1000) + 1
        geometry.attributes.uv.array = geometry.attributes.uv.array.map(e => e += s)

        var plane = new THREE.Mesh(geometry, shader_material);

        plane.position.copy(pos)
        plane.userData.pos = pos
        cloud.add(plane)
    }
    setInterval(() => {
        if (cloud) {
            cloud.children.map(plane => {
                plane.material.uniforms.random.value = Math.random()
                // let s = Math.floor(Math.random()*1000) + 1
                // plane.geometry.attributes.uv.array = plane.geometry.attributes.uv.array.map(e => e=s)
            })
        }
    }, 100)
    // --------

    controller = new OrbitControls(camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);
    window.onresize = onResize;
}

function initMaterial() {
    let loader = new THREE.TextureLoader()
    return new THREE.ShaderMaterial({
        uniforms: {
            texture1: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/1.png')
            },
            texture2: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/2.png')
            },
            texture3: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/3.png')
            },
            texture4: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/4.png')
            },
            texture5: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/5.png')
            },
            texture6: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/6.png')
            },
            texture7: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/7.png')
            },
            texture8: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/8.png')
            },
            texture9: {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=codeCloud) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
