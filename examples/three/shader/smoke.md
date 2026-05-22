---
title: "燃烧烟雾 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,燃烧烟雾"
outline: deep
---
# 燃烧烟雾

*Smoke*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=smoke)

![燃烧烟雾](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/smoke.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

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

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 基础场景设置
const DOM = document.querySelector("#box"), width = DOM.clientWidth, height = DOM.clientHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xbfe3dd, 1)
renderer.setSize(width, height);
DOM.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100000).translateX(5);
new OrbitControls(camera, renderer.domElement).target.set(0, 0.5, 0);

// 核心变量
const clock = new THREE.Clock(), particles = [];
let delta = 0, emitTime = 0;

// 粒子配置
const config = {
    wind: [0.001, 0, 0],
    emit: { pos: [0, 0, 0], r1: 0.1, r2: 0.8, height: 8, rate: 0.05, maxPerFrame: 3 },
    particle: {
        life: [4, 5], rot: [0.2, 0.4], speed: [0.008, 0.012], 
        scale: 0.3, growth: 0.006, fade: 0.006, opacity: 0.8, blend: 0.95,
        color: { start: [0.8, 0.8, 0.8], end: [0.2, 0.2, 0.2], speed: [0.3, 0.4] },
        brightness: [0.8, 1]
    }
};

// 工具函数
const rand = (a, b) => a + Math.random() * (b - a);
const randCircle = (r) => {
    const rad = r * Math.sqrt(Math.random()), ang = Math.PI * 2 * Math.random();
    return [rad * Math.cos(ang), rad * Math.sin(ang)];
};

// 创建几何体
const geo = new THREE.InstancedBufferGeometry();
geo.setAttribute("position", new THREE.Float32BufferAttribute([-0.5,0.5,0, -0.5,-0.5,0, 0.5,0.5,0, 0.5,-0.5,0, 0.5,0.5,0, -0.5,-0.5,0], 3));
geo.setAttribute("uv", new THREE.Float32BufferAttribute([0,1, 0,0, 1,1, 1,0, 1,1, 0,0], 2));

// 创建实例属性
const attrDefs = [["offset",3],["scale",2],["quaternion",3],["rotation",1],["color",4],["blend",1],["texture",1]];
const attrs = {};
attrDefs.forEach(([name, size]) => {
    attrs[name] = new Float32Array(100 * size);
    geo.setAttribute(name, new THREE.InstancedBufferAttribute(attrs[name], size));
});

// 创建材质和网格
const material = new THREE.ShaderMaterial({
    uniforms: { map: { value: new THREE.TextureLoader().load(FILE_HOST + "images/channels/snow.png") }, time: { value: 0 } },
    vertexShader: `
        attribute vec3 offset; attribute vec2 scale; attribute vec3 quaternion; attribute float rotation;
        attribute vec4 color; attribute float blend; uniform float time; varying vec2 vUv;
        varying vec4 vColor; varying float vBlend;
        void main() {
            float a = time * rotation, c = cos(a), s = sin(a);
            vec3 vR = vec3(position.x*scale.x*c - position.y*scale.y*s, position.y*scale.y*c + position.x*scale.x*s, 0.0);
            vec3 vL = offset - cameraPosition, up = vec3(0,1,0);
            vec3 right = normalize(cross(vL, up));
            vec3 vP = vR.x * right + vR.y * up + offset;
            vUv = uv; vColor = color; vBlend = blend;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vP, 1.0);
        }`,
    fragmentShader: `
        uniform sampler2D map; varying vec2 vUv; varying vec4 vColor; varying float vBlend;
        void main() {
            vec4 c = texture2D(map, vUv) * vColor;
            gl_FragColor = c; gl_FragColor.rgb *= gl_FragColor.a; gl_FragColor.a *= vBlend;
        }`,
    transparent: true, depthWrite: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor
});

const mesh = new THREE.Mesh(geo, material);
mesh.frustumCulled = false;
scene.add(mesh);

// 主循环
function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta();
    
    // 发射新粒子
    emitTime += delta;
    let emitCount = Math.min(Math.floor(emitTime / config.emit.rate), config.emit.maxPerFrame);
    emitTime -= emitCount * config.emit.rate;
    
    while(emitCount-- > 0) {
        // 计算发射位置和方向
        const [x1, z1] = randCircle(config.emit.r1);
        const [dx, dz] = randCircle(config.emit.r2);
        const dir = [dx, config.emit.height, dz];
        const len = Math.hypot(...dir);
        const speed = rand(...config.particle.speed);
        const bright = rand(...config.particle.brightness);
        
        // 添加粒子
        particles.push({
            p: [x1, 0, z1], // 位置
            v: dir.map(v => v * speed / len), // 速度
            s: config.particle.scale, // 大小
            r: rand(...config.particle.rot), // 旋转
            c: [...config.particle.color.start.map(c => c * bright), config.particle.opacity], // 颜色
            ce: config.particle.color.end.map(c => c * bright), // 目标颜色
            ct: 0, // 颜色过渡
            cs: rand(...config.particle.color.speed), // 颜色速度
            l: rand(...config.particle.life), // 生命周期
            b: config.particle.blend // 混合值
        });
    }
    
    // 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // 更新位置
        for (let j = 0; j < 3; j++) p.p[j] += p.v[j] + config.wind[j];
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=smoke) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
