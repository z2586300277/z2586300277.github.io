---
title: "溶解动画 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,溶解动画"
outline: deep
---
# 溶解动画

*Dissolve*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=dissolveAnimate)

![溶解动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/dissolveAnimate.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时
- Stats 性能监视

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`updateMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

var scene, camera, renderer, clock, controller, stats
var dissolveMaterials = []

init();
animate();

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(15, 5, 15)
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿处理
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)

    let shader_material = new THREE.ShaderMaterial({
        uniforms: {
            dissolveMap: {
                value: new THREE.TextureLoader().load(FILE_HOST + "threeExamples/shader/tex2.png")
            },
            texture2: {
                value: new THREE.TextureLoader().load(FILE_HOST + "threeExamples/shader/earth1.jpg")
            },
            color: {
                value: new THREE.Color(1, 0, 0)
            },
            time: {
                value: 0
            },
            flag: {
                value: true
            }
        },
        vertexShader: `    varying vec2 vUv;
  varying vec3 worldPos;
  void main() {
      vUv = uv;
      worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
        fragmentShader: `
  varying vec2 vUv;
 
  uniform sampler2D dissolveMap;
  uniform sampler2D texture2;
  uniform float time;
  varying vec3 worldPos;
  uniform bool flag;
  void main() {
    
    float bottom = -2.0;
    float top = 2.0;
    float yScale = (worldPos.y - bottom)/(top - bottom);
 
    vec4 color = texture2D( texture2, vUv);
    //vec4 color = vec4(1.0, 0.0, 0.0, 0.3);
    
    //float t = 1. - fract(time);
    float t;
    if(flag) {
      t = fract(time);
    }else {
      t = 1. - fract(time);
    }
    
    float h = texture2D( dissolveMap, vUv).r;

    float dissolveWidth = 4.0; // 值越大越窄

    float condition_if_1 = step(h + yScale*dissolveWidth, t*(dissolveWidth + 1.0) + 0.04);
    float condition_if_2 = step(h + yScale*dissolveWidth, t*(dissolveWidth + 1.0));
    color = mix(color, vec4(1.0 ,1.0 , 0.0, 1.0), condition_if_1 );
    color = color * (1. - condition_if_2);
    
    gl_FragColor = color;
  }`,
        transparent: true,
        depthWrite: false
    });
    dissolveMaterials.push(shader_material)

    var axisHelper = new THREE.AxesHelper(10);
    scene.add(axisHelper)
    stats = new Stats()
    document.body.appendChild(stats.dom);

    var geometry = new THREE.BoxGeometry(4, 4, 4);
    var cube = new THREE.Mesh(geometry, shader_material);
    scene.add(cube);

    controller = new OrbitControls(camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);
    window.onresize = onResize;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    controller.update(clock.getDelta());
    updateMaterial()
}

function updateMaterial() {
    dissolveMaterials.map(m => {
        m.uniforms.time.value += 0.005
        if (m.uniforms.time.value >= 1) {
            m.uniforms.time.value = 0
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=dissolveAnimate) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
