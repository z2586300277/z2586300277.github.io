---
title: "粒子线条 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,粒子线条"
outline: deep
---
# 粒子线条

*Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleLine)

![粒子线条](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/particleLine.jpg)

## 你将学到什么

- EffectComposer 后期处理管线
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. EffectComposer 组装 Pass 链并 render

## 代码要点

- **`getRandomColor()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`changeColor()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onWindowResize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`onMouseMove()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`updateBloom()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';      
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { GUI } from 'dat.gui';

let scene, camera, renderer, particles, lines, mouse, controls, gui, glitchPass, dotScreenPass, pixelPass, composer, material, lineMaterial;
const params = {
  particleCount: 1000,
  lineDistance: 1000,
  repulsionStrength: 5,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0,
  pixelSize: 1.0,
  bloomStrength: 1,
  bloomRadius: 0.4,
  bloomThreshold: 0,
  activateGlitch: false,
  dotScale: 0.5,
  activateDotScreen: false 
};

init()
animate()

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1200;
  scene.fog = new THREE.Fog( 0x000000, 10, 2000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.particleCount * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() * 2 - 1) * 500;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  material = new THREE.PointsMaterial({ color: getRandomColor(), size: 10, fog:true });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  lineMaterial = new THREE.LineBasicMaterial({ color: getRandomColor(), linewidth: .25, fog:true });

  lines = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
  scene.add(lines);

  mouse = new THREE.Vector2();

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onMouseMove, false);

  const renderScene = new RenderPass(scene, camera);

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), params.bloomStrength, params.bloomRadius, params.bloomThreshold);
  composer.addPass(bloomPass);

  const pixelationShader = {
    uniforms: {
      'tDiffuse': { value: null },
      'resolution': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      'pixelSize': { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 resolution;
      uniform float pixelSize;
      varying vec2 vUv;
      void main() {
          vec2 dxy = pixelSize / resolution;
          vec2 coord = dxy * floor(vUv / dxy);
          gl_FragColor = texture2D(tDiffuse, coord);
      }
  `
  };

  pixelPass = new ShaderPass(pixelationShader);
  composer.addPass(pixelPass);

  glitchPass = new GlitchPass();
  glitchPass.enabled = false;
  composer.addPass(glitchPass);

  dotScreenPass = new DotScreenPass(new THREE.Vector2(0.5, 0.5), 0.5, 0.8);
  dotScreenPass.enabled = false;
  composer.addPass(dotScreenPass);

  gui = new GUI();
  
  gui.add(params, 'lineDistance', 500, 1000);
  gui.add(params, 'repulsionStrength', 1, 10);
  gui.add(params, 'bloomStrength', 0, 3).name('Bloom Strength').onChange(updateBloom);
  gui.add(params, 'bloomRadius', 0, 1).name('Bloom Radius').onChange(updateBloom);
  gui.add(params, 'bloomThreshold', 0, 1).name('Bloom Threshold').onChange(updateBloom);
  
  gui.add(params, 'pixelSize', 1.0, 30.0).name('Pixel Size').onChange((value) => {
    pixelPass.uniforms.pixelSize.value = value;
  });
  gui.add(params, 'activateDotScreen').name('Activate Dot Screen').onChange((value) => {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=particleLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
