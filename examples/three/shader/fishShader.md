---
title: "鱼 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createBackMaterial`、`createBackGeometry`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,鱼,着色器"
outline: deep
---

# 鱼

*Fish*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fishShader)


![鱼](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/fishShader.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createBackMaterial`、`createBackGeometry`。

> 着色器 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 独立函数

- `createBackMaterial()` — 材质 / GLSL
- `createBackGeometry()` — 材质 / GLSL
- `createWeedMaterial()` — 材质 / GLSL
- `createWeedGeometry()` — 材质 / GLSL
- `createFishMaterial()` — 材质 / GLSL

## 源码

```js
import * as THREE from "three"
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
// refer https://codepen.io/prisoner849/pen/bGgQmrX
let simpleNoise = `
float N (vec2 st) { // https://thebookofshaders.com/10/
    return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
}

float smoothNoise( vec2 ip ){ // https://www.youtube.com/watch?v=zXsWftRdsvU
    vec2 lv = fract( ip );
  vec2 id = floor( ip );
  
  lv = lv * lv * ( 3. - 2. * lv );
  
  float bl = N( id );
  float br = N( id + vec2( 1, 0 ));
  float b = mix( bl, br, lv.x );
  
  float tl = N( id + vec2( 0, 1 ));
  float tr = N( id + vec2( 1, 1 ));
  float t = mix( tl, tr, lv.x );
  
  return mix( b, t, lv.y );
}
`;

let caustic = `
    vec2 cPos = vPos.xz - (1, 0.25) * vPos.y;
    vec2 cUv = (cPos - vec2(time * 1.5, 0.));

    float caustic = abs(smoothNoise(cUv) - 0.5);
    caustic = pow(smoothstep(0.5, 0., caustic), 2.);
    float causticFade = smoothNoise(cPos - vec2(time, 0.));
    caustic *= causticFade;

    float causticShade = clamp(dot(normalize(vec3(1, 1, 0.25)), vN), 0., 1.);
    caustic *= causticShade;

    gl_FragColor.rgb += vec3(caustic) * 0.25;
`;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth 
```

