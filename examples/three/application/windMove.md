---
title: "风吹动画 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,风吹动画"
outline: deep
---

# 风吹动画

*Wind Move*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=windMove)


![风吹动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/windMove.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 代码结构

- // World //
- // Scene //

## 类与方法

### Base

- `constructor()` — 初始化成员
- `main()` — 材质 / GLSL
- `init()`
- `animate()`

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `render()` — renderer.render(scene, camera)
- `initMesh()` — 材质 / GLSL

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
```

### // World //

```js
//

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
```

### // Scene //

```js
//

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
            geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(points.length * 6)
```

