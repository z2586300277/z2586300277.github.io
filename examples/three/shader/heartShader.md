---
title: "心 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,心"
outline: deep
---
# 心

*Heart Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=heartShader)

![心](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/heartShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- EffectComposer 后期处理管线
- 相机交互控制器
- 轮廓高亮 OutlinePass
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

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
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 5, 1.2, 0)

composer.addPass(bloomPass);

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

class HeartCurve extends THREE.Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(a, optionalTarget = new THREE.Vector3()) {
        const t = a * Math.PI * 2;
        const tx = 16 * Math.pow(Math.sin(t), 3);
        const ty = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const tz = 0;

        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}

const geometry = new THREE.TubeGeometry(new HeartCurve(0.5), 100, 0.1, 30, false);

const vertexShader = `
    varying vec2 vUv;
    void main(void) {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
const fragmentShader = `
    varying vec2 vUv;
    uniform float uSpeed;
    uniform float uTime;
    uniform vec2 uFade;
    uniform vec3 uColor;
    uniform float uDirection;
    void main() {
    vec3 color =uColor;
    float s=0.0;
    float v=0.0;
    if(uDirection==1.0){
    v=vUv.x;
    s=-uTime*uSpeed;
    }else{
    v= -vUv.x;
    s= -uTime*uSpeed;
    }
    float d=mod(  (v + s) ,1.0) ;
    if(d>uFade.y)discard;
    else{
    float alpha = smoothstep(uFade.x, uFade.y, d);
    if (alpha < 0.0001) discard;
    gl_FragColor =  vec4(color,alpha);
    }
} `;

const getMaterial = (uniforms) => {
    return new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true
    });
}

const material1 = getMaterial({
    uColor: { value: new THREE.Color('pink') },
    uTime: { value: 0 },
    uDirection: { value: 1 },
    uSpeed: { value: 1 },
    uFade: { value: new THREE.Vector2(0, 0.5) },
    uDirection: { value: 1 },
    uSpeed: { value: 1 }
})

const material2 = getMaterial({
    uColor: { value: new THREE.Color('#00BFFF') },
    uTime: { value: 0.5 },
    uDirection: { value: 1 },
    uSpeed: { value: 1 },
    uFade: { value: new THREE.Vector2(0, 0.5) },
    uDirection: { value: 1 },
    uSpeed: { value: 1 }
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=heartShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
