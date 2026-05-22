---
title: "水天一色 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,水天一色"
outline: deep
---
# 水天一色

*Water Sky*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waterSky)

![水天一色](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/waterSky.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环

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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50,DOM.clientWidth / DOM.clientHeight, 0.1, 100000)
camera.position.set(10,10,10)
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true, logarithmicDepthBuffer: true  })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
renderer.setPixelRatio( window.devicePixelRatio * 2)
renderer.setClearColor( 0x000000 )
DOM.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const uniforms = {
    Mouse: {
        type: 'v2',
        value: new THREE.Vector2(0, 0)
    },
    Resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    Time: {
        type: 'f',
        value: 1.0
    }
}
DOM.addEventListener('mousemove',(event) => uniforms.Mouse.value = new THREE.Vector2(
    (event.offsetX / event.target.clientWidth) * 2 - 1,
    -(event.offsetY /  event.target.clientHeight) * 2 + 1
))
const geometry = new THREE.PlaneGeometry( 10, 10 );

var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: `
    void main() {
        gl_Position = vec4( position, 1.0 );
    }
    `,
    fragmentShader: `
    uniform vec2 Mouse;
    uniform vec2 Resolution;
    uniform float Time;

    const float DRAG_MULT = 0.048;
    const int ITERATIONS_RAYMARCH = 13;
    const int ITERATIONS_NORMAL = 48;

    vec2 wavedx(vec2 position, vec2 direction, float speed, float frequency, float timeshift) {
        float x = dot(direction, position) * frequency + timeshift * speed;
        float wave = exp(sin(x) - 1.0);
        float dx = wave * cos(x);
        return vec2(wave, -dx);
    }

    float getwaves(vec2 position, int iterations){
        float iter = 0.0;
        float phase = 6.0;
        float speed = 2.0;
        float weight = 1.0;
        float w = 0.0;
        float ws = 0.0;
        for(int i=0;i<iterations;i++){
            vec2 p = vec2(sin(iter), cos(iter));
            vec2 res = wavedx(position, p, speed, phase, Time);
            position += p * res.y * weight * DRAG_MULT;
            w += res.x * weight;
            iter += 12.0;
            ws += weight;
            weight = mix(weight, 0.0, 0.2);
            phase *= 1.18;
            speed *= 1.07;
        }
        return w / ws;
    }

    float raymarchwater(vec3 camera, vec3 start, vec3 end, float depth){
        vec3 pos = start;
        float h = 0.0;
        float hupper = depth;
        float hlower = 0.0;
        vec2 zer = vec2(0.0);
        vec3 dir = normalize(end - start);
        for(int i=0;i<318;i++){
            h = getwaves(pos.xz * 0.1, ITERATIONS_RAYMARCH) * depth - depth;
            if(h + 0.01 > pos.y) {
                return distance(pos, camera);
            }
            pos += dir * (pos.y - h);
        }
        return -1.0;
    }

    float H = 0.0;
    vec3 normal(vec2 pos, float e, float depth){
        vec2 ex = vec2(e, 0);
        H = getwaves(pos.xy * 0.1, ITERATIONS_NORMAL) * depth;
        vec3 a = vec3(pos.x, H, pos.y);
        return normalize(cross((a-vec3(pos.x - e, getwaves(pos.xy * 0.1 - ex.xy * 0.1, ITERATIONS_NORMAL) * depth, pos.y)), 
                            (a-vec3(pos.x, getwaves(pos.xy * 0.1 + ex.yx * 0.1, ITERATIONS_NORMAL) * depth, pos.y + e))));
    }
    mat3 rotmat(vec3 axis, float angle)
    {
        float s = sin(angle);
        float c = cos(angle);
        float oc = 1.0 - c;
        return mat3(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s, 
        oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s, 
        oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
    }

    vec3 getRay(vec2 uv){
        uv = (uv * 2.0 - 1.0) * vec2(Resolution.x / Resolution.y, 1.0);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=waterSky) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
