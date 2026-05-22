---
title: "图片粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,particle,图片粒子"
outline: deep
---
# 图片粒子

*Image Particle*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=imgParticle)

![图片粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/imgParticle.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 粒子 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createParticles()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 粒子系统配置
const config = {
    imageUrl: HOST + 'files/author/z2586300277.png',
    targetSize: 2,      // 缩放目标大小
    depth: 0.3,           // 深度范围
    pointSize: 0.001,   // 粒子基础大小
    sizeScale: 0.5,       // 粒子大小缩放系数
    color: 0xff0000,    // 自定义颜色
    useCustomColor: false,
    intensity: 1.1,
    particleGap: 6,     // 粒子间隔(1-10, 值越大粒子越少)
    particleOpacity: 0.8  // 粒子透明度
};

createParticles(config, particles => {
    particles.position.set(-1.5, 1.5, 0);
    scene.add(particles);
});

createParticles({
    ...config,
    imageUrl: HOST + 'files/author/FFMMCC.jpg',
},
particles => {
    particles.position.set(1.5, 1.5, 0);
    scene.add(particles);
});

createParticles({
    ...config,
    imageUrl: HOST + 'files/author/flowers-10.jpg',
},
particles => {
    particles.position.set(-1.5, -1.5, 0);
    scene.add(particles);
});

createParticles({
    ...config,
    imageUrl: HOST + 'files/author/KallkaGo.jpg',
},
particles => {
    particles.position.set(1.5, -1.5, 0);
    scene.add(particles);
});

function createParticles(config, callback) {
    new THREE.TextureLoader().load(config.imageUrl, texture => {
        const { width: w, height: h } = texture.image;
        const scale = w >= h ? config.targetSize/w : config.targetSize/h;
        
        // 获取像素数据
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        [canvas.width, canvas.height] = [w, h];
        ctx.drawImage(texture.image, 0, 0);
        const data = ctx.getImageData(0, 0, w, h).data;

        // 收集顶点和颜色数据，按间隔采样以控制粒子数量
        const [positions, colors] = [[], []];
        for(let i = 0; i < data.length; i += 4 * config.particleGap) {
            if(data[i + 3] > 0) {
                const x = (i/4 % w - w/2) * scale;
                const y = -(Math.floor(i/4/w) - h/2) * scale;
                positions.push(x, y, Math.random() * config.depth);
                colors.push(data[i]/255, data[i+1]/255, data[i+2]/255);
            }
        }

        // 创建几何体和材质
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
            .setAttribute('color_list', new THREE.Float32BufferAttribute(colors, 3));

        callback(new THREE.Points(geometry, new THREE.ShaderMaterial({
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=imgParticle) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [粒子目录](/examples/three/particle/)

> 粒子 · Three.js
