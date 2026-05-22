---
title: "烟雾效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `particles_emmiter_emmit`、`particles_emmiter_update`。"
head:
  - - meta
    - name: keywords
      content: "three.js,烟雾效果"
outline: deep
---

# 烟雾效果

*Smoke Air*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=smokeAir)


![烟雾效果](https://z2586300277.github.io/3d-file-server/threeExamples/application/smokeAir.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `particles_emmiter_emmit`、`particles_emmiter_update`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 大量重复物体用 `InstancedMesh`，一次 draw call；矩阵写 `setMatrixAt`。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

var delta;
var time;

var vs = [];
var fs = [];
var mesh = [];
var tex = [];
var mat = [];

var texture_loader = new THREE.TextureLoader();

const DOM = document.querySelector("#box");
const width = DOM.clientWidth;
const height = DOM.clientHeight;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(0xb9eeff, 1);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height, false);
DOM.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    0.05,
    100000
);
camera.position.set(5,5,5)
const scene = new THREE.Scene();
const pl1 = new THREE.PointLight(0xfee3b1, 2);
pl1.position.set(-20, 20, 20);
scene.add(pl1);

const controls = new OrbitControls(camera,renderer.domElement)
controls.target.set(0,0.5,0)

const clock = new THREE.Clock();

tex["smoke"] = texture_loader.load(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2Oj
```

```js
/*
vec3 vLook=normalize(offset-cameraPosition);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;
*/

vec3 vLook=offset-cameraPosition;
vec3 vRight=normalize(cross(vLook,localUpVector));
vPosition=vRotated.x*vRight+vRotated.y*localUpVector+vRotated.z;

gl_Position=projectionMatrix*modelViewMatrix*vec4(vPosition+offset,1.0);

}

`;

fs["sprite"] = `

const int count=3;
uniform sampler2D map[count];
varying vec2 vUv;
varying vec4 vColor;
varying float vBlend;
varying float num;

void main(){

if(num==0.0){ gl_FragColor=texture2D(map[0],vUv)*vColor; }
else if(num==1.0){ gl_FragColor=texture2D(map[1],vUv)*vColor; }
else if(num==2.0){ gl_FragColor=texture2D(map[2],vUv)*vColor; }

gl_FragColor.rgb*=gl_FragColor.a;
gl_FragColor.a*=vBlend;

}

`;

var particles = [];

// ____________________ GRASS ____________________

var particles_grass_a = [];

particles_grass_a.push({
    offset: [10, 2, 0],
    scale: [4, 4],
    quaternion: [0, 0, 0, 4],
    rotation: 0,
    color: [1, 1, 1, 1],
    blend: 1,
    texture: 2,
});

for (var n = 0; n < 100; n++) {
    var scale = Math.random() * 0.5 + 0.5;
    particles_grass_a.push({
        offset: [Math.random() * 20 - 10, scale / 2, Math.random() * 20 - 10],
        scale: [scale, scale],
      
```

