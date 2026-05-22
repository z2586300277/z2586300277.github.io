---
title: "科技粒子 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,科技粒子,粒子"
outline: deep
---

# 科技粒子

*Technology*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=technologyParticle)


![科技粒子](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/technologyParticle.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 代码结构

- glsl

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 25)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const curve = new THREE.EllipseCurve(0, 0, 8, 8, 0, 2 * Math.PI, false, 0);
let pointsPos = [];

for (let i = 0; i < 5; i++) {
    pointsPos.push(...curve.getPoints(719));
    curve.xRadius += 0.2;
    curve.yRadius += 0.2;
}

const aIndex = pointsPos.map((_, index) => index);
const geometry = new THREE.BufferGeometry().setFromPoints(pointsPos);

geometry.rotateX(Math.PI * 0.5);
geometry.translate(0, 0.1, 2.5);

const geoPosList = geometry.getAttribute('position').array;
const aNormals = new Float32Array(geoPosList.length);

for (let i = 0; i < geoPosList.length / 3; i++) {

    const i3 = i * 3;
    geoPosList[i3 + 1] += Math.floor(i / 720) * 0.15;
    const baseIndex = (i % 720) * 3;
    const offsetIndex = ((i % 720) + 720 * 4) * 3;
    aNormals[i3] = geoPosList[offsetIndex] - geoPosLi
```

### glsl

```js
`
           #include <begin_vertex>
               float selfIndex = mod(aIndex, 720.0);
             float circleNum = (aIndex - selfIndex) / 720.0;
            vec3 pDir = normalize(aNormal);  

            float noise=texture(uPerlinTexture,vec2((selfIndex/720.0),mod(uTime*0.1,1.0))).r;
        
            float strength=getStrength(aIndex,uTime,aNormal);
                strength+=getStrength(aIndex,uTime+10.0+noise,aNormal);
                strength+=getStrength(aIndex,uTime+20.0+noise,aNormal);
                strength+=getStrength(aIndex,uTime+30.0+noise,aNormal);
                strength+=getStrength(aIndex,uTime+40.0+noise,aNormal);                        
                strength+=getStrength(aIndex,uTime+50.0+noise,aNormal); 
                strength+=getStrength(aIndex,uTime+60.0+noise,aNormal); 
                strength+=getStrength(aIndex,uTime+70.0+noise,aNormal);  
                strength+=getStrength(aIndex,uTime+80.0+noise,aNormal);
                strength+=getStrength(aIndex,uTime+90.0+noise,aNormal);                         
                             // 偏移的强度因子，当前没有动态变化
        
                // 基于法线方向和波动强度偏移点的 x 和 z 坐标
                transformed.x += pDir.x * strength*0.5;
                transformed.z += pDir.z* strength*0.5;
                    transformed.y += strength*circleNum*noise*0.6 ;
                //transformed.y
```

### glsl

```js
`

         varying float vIndex;
         
          uniform float uTime;
          uniform vec3 baseColor1;
          uniform sampler2D uPerlinTexture;
          uniform vec3 baseColor2;
          uniform vec3 baseColor3;
        #include <common>
    `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
```

