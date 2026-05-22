---
title: "红玫瑰 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,红玫瑰,应用场景"
outline: deep
---

# 红玫瑰

*Red Rose*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=redRose)


![红玫瑰](https://coderfmc.github.io/three.js-demo/redRouse.gif)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const flowerVs=`

uniform float uTime;
varying vec2 vUv;
void main(){
    gl_Position=vec4(position,1.);
    vUv=uv;
}
`;
const flowerFs=`

varying vec2 vUv;
uniform float uTime;
uniform float uAspectRatio;

float flower(vec3 p,  float r)
 {     
     vec3 n=normalize(p);
     
     float q=length(p);
     
     float rho=atan(length(vec2(n.x,n.z)),n.y)*15.0+q*10.01-uTime*4.;//vertical part of  cartesian to polar with some q warp

     float theta=atan(n.x,n.z)*5.0+p.y*3.0+rho*2.0-uTime ;//horizontal part plus some warp by z(bend up) and by rho(twist)
 
     return length(p) -(r+sin(theta)*0.5*(1.5-abs(dot(n,vec3(0,1,0)) )) //the 1-abs(dot()) is limiting the warp effect at poles
                        +sin(rho)*0.3  *(1.5-abs(dot(n,vec3(0,1,0)) )) );// 1.3-abs(dot()means putting some back in 
 }

vec2 map( in vec3 pos )
{
      
    return vec2( flower(pos, 0.750), 5.1 + (sin(uTime)/2.)) ;
    
}

vec2 castRay( in vec3 ro, in vec3 rd )
{
    float tmin = 1.0;
    float tmax = 20.0;
    
#if 0
    float tp1 = (0.0-ro.y)/rd.y; if( tp1>0.0 ) tmax = min( tmax, tp1 );
    float tp2 = (1.6-ro.y)/rd.y; if( tp2>0.0 ) { if( ro.y>1.6 ) tmin = max( tmin, tp2 );
                                                 else           tmax = mi
```

