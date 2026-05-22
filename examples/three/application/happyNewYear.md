---
title: "新年快乐 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createTexture`、`unit`。"
head:
  - - meta
    - name: keywords
      content: "three.js,新年快乐"
outline: deep
---

# 新年快乐

*Happy Year*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=happyNewYear)


![新年快乐](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/happyNewYear.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `createTexture`、`unit`。

> 应用场景 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 大量重复物体用 `InstancedMesh`，一次 draw call；矩阵写 `setMatrixAt`。

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

## 着色器

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
varying vec3 vPos;
          void main(){
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
```

### 片元

- 片元输出 gl_FragColor

```glsl
varying vec3 vPos;
          void main(){
            float f = smoothstep(0., 50., vPos.y);
            vec3 baseCol = vec3(0.25, 0.75, 1) * 0.5;
            vec3 topCol = vec3(1, 0.5, 1) * 0.75;
            vec3 col = mix( baseCol, topCol, f);
            
            gl_FragColor = vec4(col, 1.);
          }
```

### 顶点

```glsl
#define PI 3.14159265359
        uniform float time;
        varying vec3 vPos;
        
        float getX(float y){
          
          float x = sin(mod((y - time * 0.05) * 0.9 * PI * 2. * 9., PI * 2.));
          x *= sqrt(1. - y * y);
          return x;
        }
        
        void main(){
          float lengthFactor = uv.x;
          float e = 0.001;
          
          vec3 pos = vec3(getX(lengthFactor),lengthFactor,0.);
          vec3 pos2 = vec3(getX(lengthFactor + e), lengthFactor + e, 0.);
          vec2 tan = normalize(pos2.xy - pos.xy);
          
       
```

### 片元

- 片元输出 gl_FragColor

```glsl
uniform sampler2D texYear;
        varying vec3 vPos;
        
        void main(){
        
          vec2 tUv = (vPos.xy - vec2(-35., -10.)) / 70.;
          float dYear = texture(texYear, tUv).r;
        
          vec3 fogCol = vec3(0.25, 0.75, 1) * 0.5;
          vec3 sunCol = vec3(1, 0.875, 0.875);
          vec3 skyCol = vec3(1, 0.5, 1) * 0.75;
          vec3 col = mix(fogCol, sunCol, smoothstep(0., 30., vPos.y));
          col = mix(col, skyCol, smoothstep(50., 60., vPos.y));
          col = mix(col, vec3(1, 0.5, 0.75), dYear);
          gl_FragColor = vec4(col, 1);
    
```

### 顶点

```glsl
#include <common>
          #define S(a, b, c) smoothstep(a, b, c)
          uniform float time;
          uniform sampler2D curveData;
          
          attribute vec3 instPos;
          
          varying vec3 vPos;
          varying vec4 vmvPos;
          varying vec2 vUv;
          
          mat2 rot (float a) {return mat2(cos(a), sin(a), -sin(a), cos(a));}
          
          void main(){
            
            float t = time;
            
            // completeFactor
            vec3 iPos = vec3(instPos);
            iPos.z = -25. + mod(instPos.z + t * 2. + 25.
```

### 片元

```glsl
#define S(a, b, c) smoothstep(a, b, c)
          
          varying vec3 vPos;
          varying vec4 vmvPos;
          varying vec2 vUv;
          
          void main() {
            
            
            float ditheringRadius = S(2., 0.5, -vmvPos.z);
            if(length(fract(-vmvPos.xyz * 100.) - 0.5) < ditheringRadius) discard;
            
            vec3 baseCol = vec3(0.25, 0.75, 1);
            vec3 col = mix(baseCol * 0.5, baseCol * 1.25, S(0., 1., vPos.y));
            col = mix(baseCol * 0.5, col, S(-0.2, 0., vPos.y)); // roots
            col = mix(vec3(1, 1,
```

### 顶点

- 顶点阶段：改 gl_Position 或传 varying

```glsl
#define S(a, b, c) smoothstep(a, b, c)
        uniform float time;
        varying vec2 vUv;
        
        ${smoothNoise}
        
        void main(){
          vUv = uv;
          
          float t = time;
          vec2 rUv = uv * vec2(1., 10.);
          float nz = smoothNoise(vec2(rUv.y + t * 0.4, 1.1));
          nz -= 0.5;
          vec3 pos = position;
          pos.x *= 0.875 * S(0.5, 0.4, abs(uv.y -  0.5));
          pos.x += nz * 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        }
```

### 片元

- 片元输出 gl_FragColor

```glsl
#define S(a, b, c) smoothstep(a, b, c)
        varying vec2 vUv;
        void main(){
          vec2 uv = vUv;
          vec3 col = vec3(0.25, 0.75, 1) * 0.875;
          float absX = abs(vUv.x - 0.5) * 2.;
          float wx = fwidth(absX);
          col = mix(col, vec3(1, 0.5, 1), S(0.05 + wx, 0.05, abs(absX - 0.5))); // magenta stripes
          gl_FragColor = vec4(col, 1.);
        }
```

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let smoothNoise = `
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

class Background extends THREE.Mesh {
    constructor () {
        super(
            new THREE.SphereGeometry(500, 72, 36),
            new THREE.ShaderMaterial({
                side: THREE.BackSide,
                vertexShader: `
          varying vec3 vPos;
          void main(){
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
        `,
                fragmentShader: `
          varying vec3 vPos;
          void main(){
            float f = smoothstep(0., 50., vPos.y);
            vec3 baseCol = vec3(0.25, 0.75, 1) * 0.5;
            vec3 topCol = vec3(1, 0.5, 1) * 0.75;
            vec3 col = 
```

