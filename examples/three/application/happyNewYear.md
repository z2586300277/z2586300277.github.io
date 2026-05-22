---
title: "新年快乐 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,application,新年快乐"
outline: deep
---
# 新年快乐

*Happy Year*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=happyNewYear)

![新年快乐](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/happyNewYear.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 天空盒与环境贴图
- 点云 / 粒子 / 实例化渲染
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 应用场景 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

- **Points** 大量顶点用点精灵渲染；**InstancedMesh** 相同几何体批量绘制，降低 draw call。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`createTexture()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

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
            vec3 col = mix( baseCol, topCol, f);
            
            gl_FragColor = vec4(col, 1.);
          }
        `
            })
        );
    }
}

class Sun extends THREE.Mesh {
    constructor (gu) {
        super();
        this.gu = gu;
        this.geometry = new THREE.PlaneGeometry(1, 1, 1000, 1);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: this.gu.time,
                texYear: this.gu.texYear
            },
            vertexShader: `
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
          
          pos *= 60.;
                    
          pos.xy += vec2(-tan.y, tan.x) * sign(position.y) * 1.;
          pos.z = -250.;
          
          vPos = pos;
        
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        }
      `,
            fragmentShader: `
      
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
          
        }
      `
        });
    }
}

class SimpleFir extends THREE.Mesh {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=happyNewYear) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [应用场景目录](/examples/three/application/)

> 应用场景 · Three.js
