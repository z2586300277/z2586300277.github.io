---
title: "着色器行星 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`generate_texture`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,着色器行星,着色器"
outline: deep
---

# 着色器行星

*Shader Planet*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=shader_planet)


![着色器行星](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/shader_planet.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`generate_texture`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const box = document.getElementById("box");
const scene = new THREE.Scene();
const texture = await new THREE.TextureLoader().load(FILE_HOST + 'images/channels/8k_stars_milky_way.jpg')
scene.background = texture;
const camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    1000,
);
camera.position.set(0, 0, 20);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
};

function animate() {
    // uniforms.iTime.value += 0.01
    mesh.rotation.y += 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
import init, { fbm } from "three_noise";
const generate_texture = async () => {
    await init();

    // let noise = new ImprovedNoise();

    let texture_height = 1024,
        texture_width = 1024;
    let texture_data = new Uint8Array(texture_height * texture_width * 4);
    for (let x = 0; x < texture_width; x++) {
        for (let y = 0; y < texture_height; y++)
```

