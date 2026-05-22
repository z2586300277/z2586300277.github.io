---
title: "风吹动画 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,风吹动画"
outline: deep
---
# 风吹动画

*Wind Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windMove)

![风吹动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/windMove.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

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

## 代码要点

- **`initWorld()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`resize()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initScene()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createSpiral()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initMesh()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { innerWidth, innerHeight } = window;
const aspect = innerWidth / innerHeight;

class Base {
    constructor() {
        this.init();
        this.main();
    }
    main() {
        const vertexShader = `
				varying vec2 vUv;

				void main() {
				vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
				`;

        const fragmentShader = `
				varying vec2 vUv;

				uniform float uTime;

				void main() {
				float len = 0.15;
				float falloff = 0.1;
				float p =  mod(uTime*0.5 , 1.0);
				float alpha = smoothstep(len, len - falloff, abs(vUv.x - p));
				float width = smoothstep(len * 2.0, 0.0, abs(vUv.x - p)) * 0.5;
				alpha *= smoothstep(width, width - 0.3, abs(vUv.y - 0.5));

				alpha *= smoothstep(0.5, 0.3, abs(p - 0.5) * (1.0 + len));

				gl_FragColor.rgb = vec3(0.51);
				gl_FragColor.a = alpha;
				    //    gl_FragColor.a += 0.1;
				}
				`;

        let _renderer = this.renderer, _scene = this.scene, _camera = this.camera, _controls = this.controls;
        let _geometry;
        let _shaders = [];

        init()
        function init() {
            initWorld();
            initScene();
        }

        //=====// World //========================================//

        function initWorld() {
            window.addEventListener('resize', resize, false);
            resize();
            requestAnimationFrame(render);
        }

        function resize() {
            _renderer.setSize(window.innerWidth, window.innerHeight);
            _camera.aspect = window.innerWidth / window.innerHeight;
            _camera.updateProjectionMatrix();
        }

        function render() {
            requestAnimationFrame(render);
            if (_controls) _controls.update();
            _renderer.render(_scene, _camera);
        }

        //=====// Scene //========================================//

        function initScene() {
            initGeometry();
            for (let i = 0; i < 24; i++) initMesh();
            requestAnimationFrame(loop);
        }

        function createSpiral() {
            let points = [];
            let r = 8;
            let a = 0;
            for (let i = 0; i < 120; i++) {
                let p = (1 - i / 120);
                r -= Math.pow(p, 2) * 0.187;
                a += 0.3 - (r / 6) * 0.2;

                console.log(p, Math.pow(p, 2.5) * 6);

                points.push(new THREE.Vector3(
                    r * Math.sin(a),
                    Math.pow(p, 2.5) * 6,
                    r * Math.cos(a)
                ));
            }
            return points;
        }

        function initGeometry() {
            const points = createSpiral();

            // Create the flat geometry
            const geometry = new THREE.BufferGeometry();

            // create two times as many vertices as points, as we're going to push them in opposing directions to create a ribbon
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points.length * 3 * 2), 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(points.length * 2 * 2), 2));
            geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(points.length * 6), 1));

            points.forEach((b, i) => {
                let o = 0.1;

                geometry.attributes.position.setXYZ(i * 2 + 0, b.x, b.y + o, b.z);
                geometry.attributes.position.setXYZ(i * 2 + 1, b.x, b.y - o, b.z);

                geometry.attributes.uv.setXY(i * 2 + 0, i / (points.length - 1), 0);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windMove) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
