---
title: "饱和度(自定义Pass) - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,饱和度(自定义Pass)"
outline: deep
---
# 饱和度(自定义Pass)

*Saturation*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=saturationPass)

![饱和度(自定义Pass)](https://z2586300277.github.io/three-cesium-examples/threeExamples/effectComposer/saturationPass.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 后期处理 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. EffectComposer 组装 Pass 链并 render

## 代码要点

- **`initComposer()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addMesh()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

window.addEventListener('load', e => {
    init();
    initComposer();
    addMesh();
    render();
})

let scene, renderer, camera, orbit;
let composer;

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.add(new THREE.PointLight(0xffffff, 1, 1000, 0.01));
    camera.position.set(10, 10, 10);
    scene.add(camera);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    scene.add(new THREE.GridHelper(10, 10));
}

function initComposer() {
    composer = new EffectComposer(renderer);
    let renderPass = new RenderPass(scene, camera);
    let outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(outputPass);

    let finalMaterial = new THREE.ShaderMaterial({
        uniforms: {
            baseTexture: { value: null },
            saturation: { value: 0.2 },
            brightness: { value: 0.2 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `

            vec3 hsv2rgb( in vec3 c ){
                vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

                return c.z * mix( vec3(1.0), rgb, c.y);
            }

            vec3 rgbToHsv(vec3 rgb){
                vec3 hsv = vec3(0);
                float maxC = max(max(rgb.r,rgb.g),rgb.b);
                float minC = min(min(rgb.r,rgb.g),rgb.b);
                float delta = maxC - minC;
                if (maxC == rgb.r) hsv.x = mod((rgb.g - rgb.b)/delta,6.0)/6.0;
                if (maxC == rgb.g) hsv.x = (rgb.b - rgb.r)/(delta*6.0) + 1.0/3.0;
                if (maxC == rgb.b) hsv.x = (rgb.r - rgb.g)/(delta*6.0) + 2.0/3.0;
                hsv.y = delta/maxC;
                hsv.z = maxC;
                return hsv;
            }

            varying vec2 vUv;
            uniform sampler2D tDiffuse;
            uniform float saturation;
            uniform float brightness;
            void main(){
                vec4 col = texture2D(tDiffuse,vUv);

                vec3 hsvCol = rgbToHsv(col.rgb);
                hsvCol.y *= saturation;
                hsvCol.z *= brightness;
                vec3 col2 = hsv2rgb(hsvCol);
                gl_FragColor = vec4(col2,col.a);

                #include <colorspace_fragment>
            }
        `
    });

    let finalPass = new ShaderPass(finalMaterial)
    composer.addPass(finalPass);

    let gui = new GUI();
    gui.add(finalMaterial.uniforms.saturation, 'value', 0, 1, 0.01).name('饱和度')
    gui.add(finalMaterial.uniforms.brightness, 'value', 0, 1, 0.01).name('亮度')

}

function addMesh() {
    let geometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < 100; i++) {
        let material = new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;
        scene.add(mesh);
    }
}

function render() {
    // renderer.render(scene,camera);
    composer.render();
    orbit.update();
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=saturationPass) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
