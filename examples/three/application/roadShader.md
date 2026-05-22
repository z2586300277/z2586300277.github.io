---
title: "道路流光 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,道路流光"
outline: deep
---
# 道路流光

*Road Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=roadShader)

![道路流光](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/roadShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **EffectComposer** 多 Pass 链式渲染：RenderPass → 特效 Pass → 输出屏幕。`composer.render()` 替代 `renderer.render()`。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 选中物体外轮廓发光，常用于编辑器选中态。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. EffectComposer 组装 Pass 链并 render

## 源码

```js
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Base {
    initThree(el) {
        this.container = el;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.container.offsetWidth / this.container.offsetHeight,
            1,
            2000
        );
        this.camera.position.set(0, 10, 50);
        new OrbitControls(this.camera, this.renderer.domElement);
        this.animate();
        window.addEventListener('resize', this.onResize.bind(this));
    }
    animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }
    onResize() {
        if (this.container) {
            this.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        }
    }
}

class Road extends Base {
    constructor() {
        super();
        this.speed = 0.005;
    }
    animate() {
        if (this.materials) {
            this.materials.forEach((m) => {
                m.uniforms.uTime.value += this.speed;
                if (m.uniforms.uTime.value > 1) {
                    m.uniforms.uTime.value = 0;
                }
            })
        }
        if (this.composer) {
            this.renderer.autoClear = false;
            this.renderer.clear();
            this.normalObj.visible = false;
            this.composer.render();
            this.renderer.clearDepth();
            this.normalObj.visible = true;
        }
        this.renderer.render(this.scene, this.camera);
        this.threeAnim = requestAnimationFrame(this.animate.bind(this));
    }
    initBloom() {
        const params = {
            threshold: 0,
            strength: 0.5,
            radius: 0.5,
            exposure: 0.5
        };
        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new BloomPass(5, 20, 100);
        bloomPass.threshold = params.threshold;
        bloomPass.strength = params.strength;
        bloomPass.radius = params.radius;
        const composer = new EffectComposer(this.renderer);
        composer.addPass(renderScene);
        composer.addPass(bloomPass);
        composer.addPass(new OutputPass());
        this.composer = composer;
    }
    createChart(that) {
        this.initBloom();
        const commonUniforms = {
            uFade: { value: new THREE.Vector2(0, 0.6) },
            uOffset: { value: new THREE.Vector2(40, 20) }
        };
        const vertexMoveHeight = `
          float getMove(float u, float offset) {
            float a = u * PI * 2.0;
            return sin(a + PI * 0.25) * u * offset;
          }
          float getHeight(float u, float offset) {
            float a = u * PI * 3.0;
            return cos(a) * u * offset;
          }
        `;
        const spline = new THREE.LineCurve3(
            new THREE.Vector3(0, 0, that.height * 0.25),
            new THREE.Vector3(0, 0, -that.height * 0.75)
        );
        const geometry = new THREE.TubeGeometry(spline, that.height, that.lineWidth, 8, false);

        const vertexShader = `
      float PI = acos(-1.0);
      uniform vec2 uOffset;
      varying vec2 vUv;
      ${vertexMoveHeight}
      void main(void) {
        vUv = uv;
        float m = getMove(uv.x, uOffset.x);
        float h = getHeight(uv.x, uOffset.y);
        vec3 newPosition = position;
        newPosition.x += m;
        newPosition.y += h;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `;

        const fragmentShader = `
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=roadShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
