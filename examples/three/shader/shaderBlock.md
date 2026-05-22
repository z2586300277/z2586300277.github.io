---
title: "方块着色器 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,方块着色器"
outline: deep
---

# 方块着色器

*Shader Block*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=shaderBlock)


![方块着色器](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/shaderBlock.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
void main() {
        gl_Position = vec4( position, 1.0 );
    }
```

### 片元

```glsl
// 屏幕尺寸
    
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;



    float gTime = 0.;
    const float REPEAT = 5.0;

    // 回転行列
    mat2 rot(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c,s,-s,c);
    }

    float sdBox( vec3 p, vec3 b )
    {
        vec3 q = abs(p) - b;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }

    float box(vec3 pos, float scale) {
        pos *= scale;
        float base = sdBox(pos, vec3(.4,.4,.1)) /1.5;
        pos.xy *= 5.;
        pos.y -= 3.5;
      
```

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

const uniforms = {
    iResolution: {
        type: 'v2',
        value: new THREE.Vector2(box.clientWidth, box.clientHeight)
    },
    iTime: {
        type: 'f',
        value: 1.0
    }
}
animate()
function animate() {
    uniforms.iTime.value += 0.01
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

let geometry = new THREE.PlaneGeometry(2, 2);

let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
    void main() {
        gl_Position = vec4( position, 1.0 );
    }
    `,
    fragmentShader: `
    // 屏幕尺寸
    
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    float gTime = 0.;
    c
```

