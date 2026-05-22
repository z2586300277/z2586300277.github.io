---
title: "白云 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,白云"
outline: deep
---
# 白云

*White Cloud*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=whiteCloud)

![白云](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/whiteCloud.jpg)

## 你将学到什么

- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。入口在 `Base`。

> 着色器 · Three.js

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
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { innerWidth, innerHeight } = window;
const aspect = innerWidth / innerHeight;

class Base {
    constructor () {
        this.init();
        this.main();
    }
    main() {
        this.deltaTime = {
            value: 0
        }

        var fragmentSrc = [
            "precision mediump float;",

            "uniform vec2 iResolution;",
            "uniform float iGlobalTime;",
            "uniform vec2 iMouse;",

            "float hash( float n ) {",
            "return fract(sin(n)*43758.5453);",
            "}",

            "float noise( in vec3 x ) {",
            "vec3 p = floor(x);",
            "vec3 f = fract(x);",
            "f = f*f*(3.0-2.0*f);",
            "float n = p.x + p.y*57.0 + 113.0*p.z;",
            "return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),",
            "mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),",
            "mix(mix( hash(n+113.0), hash(n+114.0),f.x),",
            "mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);",
            "}",

            "vec4 map( in vec3 p ) {",
            "float d = 0.2 - p.y;",
            "vec3 q = p - vec3(1.0,0.1,0.0)*iGlobalTime;",
            "float f;",
            "f  = 0.5000*noise( q ); q = q*2.02;",
            "f += 0.2500*noise( q ); q = q*2.03;",
            "f += 0.1250*noise( q ); q = q*2.01;",
            "f += 0.0625*noise( q );",
            "d += 3.0 * f;",
            "d = clamp( d, 0.0, 1.0 );",
            "vec4 res = vec4( d );",
            "res.xyz = mix( 1.15*vec3(1.0,0.95,0.8), vec3(0.7,0.7,0.7), res.x );",
            "return res;",
            "}",

            "vec3 sundir = vec3(-1.0,0.0,0.0);",

            "vec4 raymarch( in vec3 ro, in vec3 rd ) {",
            "vec4 sum = vec4(0, 0, 0, 0);",
            "float t = 0.0;",
            "for(int i=0; i<64; i++) {",
            "if( sum.a > 0.99 ) continue;",

            "vec3 pos = ro + t*rd;",
            "vec4 col = map( pos );",

            "#if 1",
            "float dif =  clamp((col.w - map(pos+0.3*sundir).w)/0.6, 0.0, 1.0 );",
            "vec3 lin = vec3(0.65,0.68,0.7)*1.35 + 0.45*vec3(0.7, 0.5, 0.3)*dif;",
            "col.xyz *= lin;",
            "#endif",

            "col.a *= 0.35;",
            "col.rgb *= col.a;",
            "sum = sum + col*(1.0 - sum.a);	",

            "#if 0",
            "t += 0.1;",
            "#else",
            "t += max(0.1,0.025*t);",
            "#endif",
            "}",

            "sum.xyz /= (0.001+sum.w);",
            "return clamp( sum, 0.0, 1.0 );",
            "}",

            "void main(void) {",
            "vec2 q = gl_FragCoord.xy / iResolution.xy;",
            "vec2 p = -1.0 + 2.0*q;",
            "p.x *= iResolution.x/ iResolution.y;",
            "vec2 mo = -1.0 + 2.0*iMouse.xy / iResolution.xy;",

            // camera
            "vec3 ro = 4.0*normalize(vec3(cos(2.75-3.0*mo.x), 0.7+(mo.y+1.0), sin(2.75-3.0*mo.x)));",
            "vec3 ta = vec3(0.0, 1.0, 0.0);",
            "vec3 ww = normalize( ta - ro);",
            "vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));",
            "vec3 vv = normalize(cross(ww,uu));",
            "vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );",

            "vec4 res = raymarch( ro, rd );",

            "float sun = clamp( dot(sundir,rd), 0.0, 1.0 );",
            "vec3 col = vec3(0.6,0.71,0.75) - rd.y*0.2*vec3(1.0,0.5,1.0) + 0.15*0.5;",
            "col += 0.2*vec3(1.0,.6,0.1)*pow( sun, 8.0 );",
            "col *= 0.95;",
            "col = mix( col, res.xyz, res.w );",
            "col += 0.1*vec3(1.0,0.4,0.2)*pow( sun, 3.0 );",

            "gl_FragColor = vec4( col, 1.0 );",
            "}"
        ];

        const geometry = new THREE.SphereGeometry(5000, 50);
        const material = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.BackSide,
            uniforms: {
                iGlobalTime: this.deltaTime,
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=whiteCloud) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
