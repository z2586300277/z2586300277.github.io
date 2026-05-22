---
title: "蜡烛 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,蜡烛"
outline: deep
---
# 蜡烛

*Candle Shader*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=candleShader)

![蜡烛](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/candleShader.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 实时阴影 ShadowMap
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`flame()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`getFlameMaterial()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(3, 5, 8).setLength(15);
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101005);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight);
})

var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minPolarAngle = THREE.MathUtils.degToRad(60);
controls.maxPolarAngle = THREE.MathUtils.degToRad(95);
controls.minDistance = 4;
controls.maxDistance = 20;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.target.set(0, 2, 0);
controls.update();

var light = new THREE.DirectionalLight(0xffffff, 0.025);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.0625));

var casePath = new THREE.Path();
casePath.moveTo(0, 0);
casePath.lineTo(0, 0);
casePath.absarc(1.5, 0.5, 0.5, Math.PI * 1.5, Math.PI * 2);
casePath.lineTo(2, 1.5);
casePath.lineTo(1.99, 1.5);
casePath.lineTo(1.9, 0.5);
var caseGeo = new THREE.LatheGeometry(casePath.getPoints(), 64);
var caseMat = new THREE.MeshStandardMaterial({ color: "silver" });
var caseMesh = new THREE.Mesh(caseGeo, caseMat);
caseMesh.castShadow = true;

var paraffinPath = new THREE.Path();
paraffinPath.moveTo(0, -.25);
paraffinPath.lineTo(0, -.25);
paraffinPath.absarc(1, 0, 0.25, Math.PI * 1.5, Math.PI * 2);
paraffinPath.lineTo(1.25, 0);
paraffinPath.absarc(1.89, 0.1, 0.1, Math.PI * 1.5, Math.PI * 2);
var paraffinGeo = new THREE.LatheGeometry(paraffinPath.getPoints(), 64);
paraffinGeo.translate(0, 1.25, 0);
var paraffinMat = new THREE.MeshStandardMaterial({ color: 0xffff99, side: THREE.BackSide, metalness: 0, roughness: 0.75 });
var paraffinMesh = new THREE.Mesh(paraffinGeo, paraffinMat);
caseMesh.add(paraffinMesh);

var candlewickProfile = new THREE.Shape();
candlewickProfile.absarc(0, 0, 0.0625, 0, Math.PI * 2);

var candlewickCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0.5, -0.0625),
    new THREE.Vector3(0.25, 0.5, 0.125)
]);

var candlewickGeo = new THREE.ExtrudeGeometry(candlewickProfile, {
    steps: 8,
    bevelEnabled: false,
    extrudePath: candlewickCurve
});

var colors = [];
var color1 = new THREE.Color("black");
var color2 = new THREE.Color(0x994411);
var color3 = new THREE.Color(0xffff44);
for (let i = 0; i < candlewickGeo.attributes.position.count; i++) {
    if (candlewickGeo.attributes.position.getY(i) < 0.4) {
        color1.toArray(colors, i * 3);
    }
    else {
        color2.toArray(colors, i * 3);
    };
    if (candlewickGeo.attributes.position.getY(i) < 0.15) color3.toArray(colors, i * 3);
}
candlewickGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
candlewickGeo.translate(0, 0.95, 0);
var candlewickMat = new THREE.MeshBasicMaterial({ vertexColors: true });

var candlewickMesh = new THREE.Mesh(candlewickGeo, candlewickMat);
caseMesh.add(candlewickMesh);

// candle light
var candleLight = new THREE.PointLight(0xffaa33, 1, 5, 2);
candleLight.position.set(0, 3, 0);
candleLight.castShadow = true;
caseMesh.add(candleLight);
var candleLight2 = new THREE.PointLight(0xffaa33, 1, 10, 2);
candleLight2.position.set(0, 4, 0);
candleLight2.castShadow = true;
caseMesh.add(candleLight2);

var flameMaterials = [];
function flame(isFrontSide) {
    let flameGeo = new THREE.SphereGeometry(0.5, 32, 32);
    flameGeo.translate(0, 0.5, 0);
    let flameMat = getFlameMaterial(true);
    flameMaterials.push(flameMat);
    let flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(0.06, 1.2, 0.06);
    flame.rotation.y = THREE.MathUtils.degToRad(-45);
    caseMesh.add(flame);
}

flame(false);
flame(true);

// table
var tableGeo = new THREE.CylinderGeometry(14, 14, 0.5, 64);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=candleShader) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
