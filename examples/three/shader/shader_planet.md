---
title: "着色器行星 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,着色器行星"
outline: deep
---
# 着色器行星

*Shader Planet*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=shader_planet)

![着色器行星](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/shader_planet.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const box = document.getElementById("box");
const scene = new THREE.Scene();
const texture = await new THREE.TextureLoader().load(FILE_HOST + 'images/channels/8k_stars_milky_way.jpg')
scene.background = texture;
const camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    1000,
);
camera.position.set(0, 0, 20);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
};

function animate() {
    // uniforms.iTime.value += 0.01
    mesh.rotation.y += 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
import init, { fbm } from "three_noise";
const generate_texture = async () => {
    await init();

    // let noise = new ImprovedNoise();

    let texture_height = 1024,
        texture_width = 1024;
    let texture_data = new Uint8Array(texture_height * texture_width * 4);
    for (let x = 0; x < texture_width; x++) {
        for (let y = 0; y < texture_height; y++) {
            // const noisevalue = noise.noise(x, y, 0.325);
            let fbm_value = fbm(
                x / texture_width,
                y / texture_height,
                6,
                2.0,
                1.5,
            );
            let color = fbm_value * 128 + 128;
            let i = (x + y * texture_width) * 4;
            texture_data[i] = color;
            texture_data[i + 1] = color;
            texture_data[i + 2] = fbm_value * 255;
            texture_data[i + 3] = 255;
        }
    }
    const texture = new THREE.DataTexture(
        texture_data,
        texture_width,
        texture_height,
        THREE.RGBAFormat,
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, -1);
    texture.needsUpdate = true;
    return texture;
};
let material,mesh;
const add_sky_sphere = async () => {
    const texture = await generate_texture();
    const uniforms = {
        u_texture: {
            value: texture,
        },
    };
    const sphere_geo = new THREE.SphereGeometry(5, 100, 100);
    const vertexShader = `
              varying vec2 vUv;
              void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
          `;
    const fragmentShader = `
            varying vec2 vUv;
            uniform sampler2D u_texture;
            void main(){
                  vec2 uv = vUv;
                  vec4 color = texture2D(u_texture,uv);
                  gl_FragColor = color;
            }
          `;
    material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        // wireframe:true
    });
    mesh = new THREE.Mesh(sphere_geo, material);
    // mesh.translateX(-10);
    material.needsUpdate = true
    scene.add(mesh);
};

const change_material = ()=>{
    if (params.showTerrain) {
        material.vertexShader = `
        uniform sampler2D u_texture;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec4 color = texture2D(u_texture, uv);
            // float height = length(color);
            float height = color.r;
            vec3 newPosition = position + normal * height * 1.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=shader_planet) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
