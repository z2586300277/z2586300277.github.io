---
title: "地球粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,地球粒子"
outline: deep
---
# 地球粒子

*Globe Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=globeParticle)

![地球粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/globeParticle.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- EffectComposer 后期处理管线
- 相机交互控制器
- 天空盒与环境贴图
- 点云 / 粒子 / 实例化渲染

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. EffectComposer 组装 Pass 链并 render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020209);
scene.fog = new THREE.Fog(0x020209, 15, 60);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.getElementById("box").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x333366, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffcc, 1.2);
directionalLight.position.set(1, 3, 2);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x3366ff, 2, 10);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.2,
  0.7,
  0.5
);
composer.addPass(bloomPass);

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrectionPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.5;
controls.minDistance = 3;
controls.maxDistance = 15;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

controls.addEventListener("start", () => {
  document.body.style.cursor = "grabbing";
  controls.autoRotate = false;
});

controls.addEventListener("end", () => {
  document.body.style.cursor = "grab";
  setTimeout(() => { controls.autoRotate = true; }, 3000);
});

const numParticles = 30000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(numParticles * 3);
const colors = new Float32Array(numParticles * 3);
const sizes = new Float32Array(numParticles);
const speeds = new Float32Array(numParticles);

for (let i = 0; i < numParticles; i++) {
  if (i < numParticles * 0.8) {
    const phi = Math.acos(-1 + (2 * i) / (numParticles * 0.8));
    const theta = Math.sqrt(numParticles * Math.PI) * phi;
    const radius = 1.8 + Math.random() * 0.4;
    const x = Math.sin(phi) * Math.cos(theta) * radius;
    const y = Math.sin(phi) * Math.sin(theta) * radius;
    const z = Math.cos(phi) * radius;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  } else {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 3;
    const height = (Math.random() - 0.5) * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  const distance = Math.sqrt(
    positions[i * 3] ** 2 +
    positions[i * 3 + 1] ** 2 +
    positions[i * 3 + 2] ** 2
  );

  let color;
  if (distance < 1.5) {
    color = new THREE.Color(0x4466ff);
  } else if (distance < 2.5) {
    color = new THREE.Color(0x9944ff);
  } else {
    color = new THREE.Color(0xff44aa);
  }

  color.offsetHSL(0, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.2);
  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;

  sizes[i] = distance < 2 ? 0.05 + Math.random() * 0.04 : 0.03 + Math.random() * 0.03;
  speeds[i] = 0.4 + Math.random() * 0.6;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=globeParticle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
