---
title: "咖啡 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,咖啡"
outline: deep
---
# 咖啡

*Coffee Mug*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=coffeeMug)

![咖啡](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/coffeeMug.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 核心概念

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'dat.gui'

const initializeScene = ({ root, antialias = true } = {}) => {
    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.z = 110;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    root.appendChild(renderer.domElement);

    const onWindowResize = () => {
        // Adjust camera and renderer on window resize
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        controls.update();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    };
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    // Create GUI
    const gui = new GUI({ container: root });

    const stats = new Stats();
    stats.showPanel(0);
    root.appendChild(stats.domElement);

    return {
        scene,
        renderer,
        camera,
        controls,
        gui,
        stats,
    };
};

const init = (root) => {
    const { scene, renderer, camera, gui, stats, controls } = initializeScene({
        root,
    });

    camera.position.set(12, 6, 12);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load(FILE_HOST + 'examples/coffeeMug/coffeeMug.glb', (gltf) => {
        gltf.scene.getObjectByName('baked').material.map.anisotropy = 8;
        controls.target.y += 3;
        scene.add(gltf.scene);
    });

    const textureLoader = new THREE.TextureLoader();
    const perlinTexture = textureLoader.load(FILE_HOST + 'examples/coffeeMug/perlin.png');
    perlinTexture.wrapS = THREE.RepeatWrapping;
    perlinTexture.wrapT = THREE.RepeatWrapping;

    const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
    smokeGeometry.translate(0, 0.5, 0);
    smokeGeometry.scale(1.5, 6, 1.5);

    const smokeMaterial = new THREE.ShaderMaterial({
        // wireframe: true,
        vertexShader:`#define M_PI 3.1415926535897932384626433832795

        varying vec2 vUv;
        
        uniform float uTime;
        uniform sampler2D uPerlinTexture;
        
        vec2 rotate2D(vec2 value, float angle)
        {
        float s = sin(angle);
        float c = cos(angle);
        mat2 m = mat2(c, s, -s, c);
        return m * value;
        }

        
        void main()
        {
          vUv = uv;
        
          vec3 newPosition = position;
          float angle = texture(
            uPerlinTexture,
            vec2(0.5, uv.y * 0.3 + uTime * 0.02
          )).x * 7.;
          newPosition.xz = rotate2D(position.xz, angle);
        
          vec2 windOffset = vec2(
            texture(uPerlinTexture, vec2(0.2, uTime * 0.02)).x - 0.5,
            texture(uPerlinTexture, vec2(0.7, uTime * 0.02)).x - 0.5
          );
        
          newPosition.xz += windOffset * pow(uv.y, 2.) * 8.;
        
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
        }
        `,
        fragmentShader:`varying vec2 vUv;

        uniform float uTime;
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=coffeeMug) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
