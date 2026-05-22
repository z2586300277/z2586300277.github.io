---
title: "点星感谢 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,点星感谢"
outline: deep
---
# 点星感谢

*Text Star*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=textStarShader)

![点星感谢](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/textStarShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
    const tessellateModifier = new TessellateModifier(4, 3);
    geometry = tessellateModifier.modify(geometry);
    const numFaces = geometry.attributes.position.count / 3;
    const colors = new Float32Array(numFaces * 3 * 3);
    const displacement = new Float32Array(numFaces * 3 * 3);
    const color = new THREE.Color();

    for (let f = 0; f < numFaces; f++) {
        const index = 9 * f;
        if (Math.random() > 0.5) {

            const h = 0.2 * Math.random();
            const s = 0.5 + 0.5 * Math.random();
            const l = 0.5 + 0.5 * Math.random();

            color.setHSL(h, s, l);
        }
        else color.set(0xa58fb5);
        const d = 60 * (0.5 - Math.random());
        for (let i = 0; i < 3; i++) {
            colors[index + (3 * i)] = color.r;
            colors[index + (3 * i) + 1] = color.g;
            colors[index + (3 * i) + 2] = color.b;
            displacement[index + (3 * i)] = d;
            displacement[index + (3 * i) + 1] = d;
            displacement[index + (3 * i) + 2] = d;
        }
    }

    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 3));

    uniforms = { amplitude: { value: 0.0 }, opacityf: { value: 0.8 } }

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `uniform float amplitude;
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
        }`,
        fragmentShader: `
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
                    wave_width = abs(1.0 / (200.0*abs(cos(iTime)) * uv.y));
                    wave_color += vec3(wave_width *( 0.4+((i+1.0)/18.0)), wave_width * (i / 9.0), wave_width * ((i+1.0)/ 8.0) * 1.9);
                }
                
                const float ambient = 0.4;
                vec3 light = vec3( 1.0 );
                light = normalize( light );
                float directional = max( dot( vNormal, light ), 0.0 );
                gl_FragColor = vec4( mix(( directional + ambient ) * vColor, wave_color,  0.6), opacityf );
            }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=textStarShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
