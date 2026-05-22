---
title: "飞线效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,飞线效果"
outline: deep
---
# 飞线效果

*Fly Line*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flyLine)

![飞线效果](https://z2586300277.github.io/3d-file-server/threeExamples/application/flyLine/colorful.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环
- Clock 帧间隔计时

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`initRender()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initCamera()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initScene()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initLight()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addflyline()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`addglobe()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';

var renderer,clock,scene,camera;
    
function initRender() {
    clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({antialias: true,alpha:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-200, 250, 350);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function initScene() {
    scene = new THREE.Scene();

}

function initLight() {
    var hemisphereLight1 = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
    hemisphereLight1.position.set(0, 200, 0);
    scene.add(hemisphereLight1);
}

var linegroup = [];
function addflyline(minx,maxx,colorf,colort){
    var colorf = colorf||{
        r:0.0,
        g:0.0,
        b:0.0
    };
    var colort = colort||{
        r:1.0,
        g:1.0,
        b:1.0
    };
    var curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3( minx, 0, minx ),
        new THREE.Vector3( minx/2, maxx % 70 + 100, maxx/2 ),
        new THREE.Vector3( maxx/2, maxx % 70 + 70, maxx/2 ),
        new THREE.Vector3( maxx, 0, maxx )
    );
    var points = curve.getPoints( (maxx - minx) * 5  );
    var geometry = new THREE.BufferGeometry().setFromPoints( points );
    var material = createMaterial();
    var flyline = new THREE.Points( geometry, material );
    flyline.material.uniforms.time.value = minx;
    flyline.material.uniforms.colorf = {
        type:'v3',
        value:new THREE.Vector3(colorf.r,colorf.g,colorf.b)
    };
    flyline.material.uniforms.colort = {
        type:'v3',
        value:new THREE.Vector3(colort.r,colort.g,colort.b)            
    };

    flyline.minx = minx;
    flyline.maxx = maxx;
    linegroup.push(flyline);
    scene.add(flyline);
}

// 添加地球
var globeMesh;
function addglobe() {
    var axesHelper = new THREE.AxesHelper( 400 );
    scene.add( axesHelper );
    var globeTextureLoader = new THREE.TextureLoader();
    globeTextureLoader.load(FILE_HOST + 'threeExamples/application/flyLine/earth.jpeg', function (texture1) {
        console.log(texture1)
        var globeGgeometry = new THREE.SphereGeometry(60, 100, 100);
        var globeMaterial = new THREE.MeshStandardMaterial({map: texture1});
        globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
        scene.add(globeMesh);
    });
}

//创建ShaderMaterial纹理的函数
function createMaterial() {
    var vertShader = `  uniform float time;
    uniform float size;
    varying vec3 iPosition;

    void main(){
        iPosition = vec3(position);
        float pointsize = 1.;
        if(position.x > time && position.x < (time + size)){
            pointsize = (position.x - time) / size;
        }
        gl_PointSize = pointsize * 3.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }`
    var fragShader = `   uniform float time;
    uniform float size;
    uniform vec3 colorf;
    uniform vec3 colort;

    varying vec3 iPosition;

    void main( void ) {
        float end = time + size;
        vec4 color;
        if(iPosition.x > end || iPosition.x < time){
            discard;
            //color = vec4(0.213,0.424,0.634,0.3);
        }else if(iPosition.x > time && iPosition.x < end){
            float step = fract((iPosition.x - time)/size);

            float dr = abs(colort.x - colorf.x);
            float dg = abs(colort.y - colorf.y);
            float db = abs(colort.z - colorf.z);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=flyLine) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
