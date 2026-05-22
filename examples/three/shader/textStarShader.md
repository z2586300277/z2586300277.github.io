---
title: "点星感谢 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`onWindowResize`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,点星感谢,着色器"
outline: deep
---

# 点星感谢

*Text Star*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=textStarShader)


![点星感谢](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/textStarShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `init`、`onWindowResize`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `render()` — renderer.render(scene, camera)

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform float amplitude;
        attribute vec3 customColor;
        attribute vec3 displacement;
        varying vec3 vNormal;
        varying vec3 vColor;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vNormal = normal;
            vColor = customColor;
            vec3 newPosition = position + normal * amplitude * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
```

### 片元

```glsl
varying vec3 vNormal;
            varying vec3 vColor;
            varying vec2 vUv;
            uniform float opacityf;
            uniform float amplitude;
            void main() {

                vec2 uv = vUv;
                float iTime = amplitude;
                vec3 wave_color = vec3(0.0);
                float wave_width = 0.0;
                for(float i = 0.0; i <= 28.0; i++) {
                    uv.y += (0.2+(0.9*sin(iTime*0.4) * sin(uv.x + i/3.0 + 3.0 *iTime )));
                    uv.x += 1.7* sin(iTime*0.4);
                    wave_width = abs(1.0 / (200.0*ab
```

## 源码

```js
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const data = await new Promise((r) => {
    fetch('https://api.github.com/repos/z2586300277/three-cesium-examples').then(res => res.json()).then(d => r(d))
    setTimeout(() => r({
        stargazers_count: 230,
        forks_count: 40
    }), 1000)
})

let mesh, uniforms, renderer, scene, camera, controls;

const loader = new FontLoader()
loader.load(FILE_HOST + 'files/json/font.json', font => init(font))

const text =
    `three-cesium-examples 

Stars ${data.stargazers_count}   Fork ${data.forks_count}

Thanks for your star
`

function init(font) {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(100, 400, 600);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    let geometry = new TextGeometry(text, {
        font: font,
        size: 30,
        depth: 5,
        curveSegments: 3,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true
    })

    geometry.center();
    const 
```

