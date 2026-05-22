---
title: "图片移动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `R`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,图片移动,应用场景"
outline: deep
---

# 图片移动

*Image Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=imageMove)


![图片移动](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/imageMove.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `R`。

> 应用场景 · Three.js

## 独立函数

- `R()` — 材质 / GLSL

## 源码

```js
import * as THREE from 'three';

const [w, h] = [innerWidth, innerHeight]
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader()
const urls = [
    FILE_HOST + 'images/wx_star.png',
    FILE_HOST + 'images/QQ.png',
    FILE_HOST + 'images/nico.jpg',
]
const tex = urls.map(u => loader.load(u));
tex[2].wrapS = tex[2].wrapT = THREE.RepeatWrapping; tex[2].repeat.set(.1, .1);

function R(g, t) {
    const m = new THREE.MeshMatcapMaterial({ matcap: t, transparent: true });
    m.onBeforeCompile = sh => {
        sh.vertexShader = sh.vertexShader
            .replace('#include <common>', `\n#include <common>\nvarying vec2 vUv;`)
            .replace('#include <fog_vertex>', `\n#include <fog_vertex>\nvUv=uv;`);
        sh.fragmentShader = sh.fragmentShader
            .replace('#include <common>', `\n#include <common>\nvarying vec2 vUv;\nfloat sdf(vec2 c,vec2 s,float r){return length(max(abs(c)-s+r,0.0))-r;}`)
            .replace('#include <dithering_fragment>', `\n#include <dithering_fragment>\nfloat d=sdf(vUv-vec2(.5),vec2(.5),.08);\nfloat a=1.-smoothstep(0.,.002,d);\ngl_FragColor=vec4(outgoingLight,a);`);
    };

```

