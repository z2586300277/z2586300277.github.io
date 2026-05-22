---
title: "3D热力图 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`getRandom`。"
head:
  - - meta
    - name: keywords
      content: "three.js,3D热力图"
outline: deep
---

# 3D热力图

*Heatmap 3D*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=heatmap3D)


![3D热力图](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/heatmap3D.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`、`getRandom`。

> 扩展功能 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- heatmap.js 自行安装module 方式引入  此处我为src 方式引入

## 独立函数

- `animate()` — rAF：update controls + render

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
uniform sampler2D heightMap;
			uniform float heightRatio;
			varying vec2 vUv;
			varying float hValue;
			varying vec3 cl;
			void main() {
			    vUv = uv;
			    vec3 pos = position;
		        cl = texture2D(heightMap, vUv).rgb;
		        hValue = texture2D(heightMap, vUv).r;
		        pos.y = hValue * heightRatio;
		        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
		    }
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying float hValue;
			varying vec3 cl;
			void main() {
		 		float v = abs(hValue - 1.);
		 		gl_FragColor = vec4(cl, .8 - v * v) ; 
		    }
```

## 源码

```js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
```

### heatmap.js 自行安装module 方式引入  此处我为src 方式引入

```js
const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(0, 40, 40)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(500), new THREE.AmbientLight(0xffffff, 3))

window.onresize = () => {

    renderer.setSize(DOM.clientWidth, DOM.clientHeight)

    camera.aspect = DOM.clientWidth / DOM.clientHeight

    camera.updateProjectionMatrix()

}

animate()

// 渲染 
function animate() {

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

const getRandom = (max, min) => Math.round((Math.random() * (max - min + 1) + min) * 10) / 10

var heatmap = h337.create({
    container: document.createElement('div'),
    width: 256,
    height: 256,
    blur: '0.8',
    radius: 10
});

var i = 0, max = 10, data = [];
while (i < 2000) {
    data.push({ x: getRandom(1, 256), y: getRandom(1, 256), value: getRandom(1, 6) });
    i++;
}

heatmap.setData({
    max: max,
    data: data
});

const texture = new THREE.CanvasTexture(heatmap._renderer.canvas);
const geomet
```

