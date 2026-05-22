---
title: "边缘模糊效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,边缘模糊效果"
outline: deep
---

# 边缘模糊效果

*Edge Blur*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=EdgeBlurringEffect)


![边缘模糊效果](https://z2586300277.github.io/3d-file-server/images/four/EdgeBlurringEffect.png)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `animate`。

> 后期处理 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from "three";
import { Color, UniformsUtils } from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

scene.background = new Color(0xffffff);

const vertexShader = `
    precision highp float;
    precision highp int;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    attribute vec3 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;
const fragmentShader = `
    precision highp float;
    precision highp int;

    uniform float edge;
    uniform float opacity;

    uniform sampler2D map;

    varying vec2 vUv;

    void main(){
      float edgeMin = edge;
      float edgeMax = 1.0 - edge;

      gl_FragColor = texture2D( map, vUv );

      if(vUv.x < edgeMin){
        if(vUv.y < edgeMin){ // 1
            gl_FragColor.a = (min(vUv.x / edgeMin, vUv.y / edgeMin)) * opacity;
        }
        else if(vUv.y >= edgeMin && vUv.y <= edgeMax){ // 4
            gl_FragColor.a = (vUv.x / edgeMin) * opacity;
        }
        else if(vUv.y > edgeMax){ // 7
            gl_FragColor.a = (min(vUv.x / edgeMin, 1.0 - ((vUv.y - edgeMax) / edgeMin))) * opacity;
        
```

