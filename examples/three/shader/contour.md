---
title: "魔幻山体 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`add_plane`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,魔幻山体,着色器"
outline: deep
---

# 魔幻山体

*Contour*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=contour)


![魔幻山体](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/contour.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`add_plane`。

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
// 魔幻山体-等高线示意
const box = document.getElementById("box");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0.5, 1, 0.875);
scene.fog = new THREE.Fog(scene.background, 20, 45);
const camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    1000,
);
camera.position.set(0, 10, 10);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
};

animate();
function animate() {
    // uniforms.iTime.value += 0.01
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

//  添加一个plane
import { Clock, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
const add_plane = () => {
    const clock = new Clock();
    const planeGeometry = new PlaneGeometry(50, 50, 500, 500);
    planeGeometry.rotateX(-Math.PI / 2)
    let uniforms = {
        u_time: {
            value: clock.getDelta()
        }
    }
    // shader material
    const vertexShader = `

   
```

