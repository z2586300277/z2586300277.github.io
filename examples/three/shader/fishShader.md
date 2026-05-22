---
title: "鱼 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,鱼"
outline: deep
---
# 鱼

*Fish*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fishShader)

![鱼](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/fishShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

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

## 代码要点

- **`createBackMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createBackGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createWeedMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createWeedGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createFishMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`createFishGeometry()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(-5, 0, 10);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x66775f);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1.0, 1.0, 0.25);
scene.add(light, new THREE.AmbientLight(0xffffff, 1));

// fish
let fishGeom = createFishGeometry();
let fishMat = createFishMaterial();
let fishSize = new THREE.Box3().setFromBufferAttribute(fishGeom.attributes.position);
fishMat.userData.uniforms.totalLength.value = fishSize.max.x;
//console.log(fishSize.max.x);
let fish = new THREE.Mesh(fishGeom, fishMat)
scene.add(fish);

// weed
let weedGeom = createWeedGeometry();
let weedMat = createWeedMaterial();
let weed = new THREE.Mesh(weedGeom, weedMat);
scene.add(weed);

// back
let backGeom = createBackGeometry();
let backMat = createBackMaterial();
let backMesh = new THREE.Mesh(backGeom, backMat);
scene.add(backMesh);

window.onresize = function () {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( innerWidth, innerHeight );
};

// RENDER /////////////////////////////////////////////////////////////////////////////////////////////////////////
let clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  let t = clock.getElapsedTime();
  fishMat.userData.uniforms.time.value = t * 1.5;
  weedMat.userData.uniforms.time.value = t;
  fish.position.y = Math.sin(t * 0.314) * 0.25;
  fish.position.z = Math.cos(t * 0.27) * 0.75;
  controls.update();
  renderer.render(scene, camera);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createBackMaterial(){
  let m = new THREE.MeshBasicMaterial({
    color: 0x66775f,
    side: THREE.BackSide,
    onBeforeCompile: shader => {
      shader.fragmentShader = `
        ${shader.fragmentShader}
      `.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
        vec3 col = mix(diffuse, diffuse + vec3(0.75), smoothstep(0.5, 0.7, vUv.y));
        vec4 diffuseColor = vec4( col, opacity );
        `
      );
      ;
      //console.log(shader.fragmentShader);
    }
  });
  m.defines = {"USE_UV" : ""};
  return m;
}
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=fishShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
