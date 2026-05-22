---
title: "边缘模糊效果 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,effectComposer,边缘模糊效果"
outline: deep
---
# 边缘模糊效果

*Edge Blur*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=EdgeBlurringEffect)

![边缘模糊效果](https://z2586300277.github.io/3d-file-server/images/four/EdgeBlurringEffect.png)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 天空盒与环境贴图
- requestAnimationFrame 渲染循环

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 后期处理 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **CubeTexture** 六面贴图作 `scene.background`；`scene.environment` 供 PBR 材质反射。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

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
        }
        else{
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // for debug
        }
      }
      else if(vUv.x >= edgeMin && vUv.x <= edgeMax){
            if(vUv.y < edgeMin){ // 2
                gl_FragColor.a = (vUv.y / edgeMin) * opacity;
            }
            else if(vUv.y >= edgeMin && vUv.y <= edgeMax){ // 5(center)
                gl_FragColor.a = 1.0 * opacity;
            }
            else if(vUv.y > edgeMax){ // 8
                gl_FragColor.a = (1.0 - ((vUv.y - edgeMax) / edgeMin)) * opacity;
            }
      }
      else if(vUv.x > edgeMax){
            float xNormal = 1.0 - ((vUv.x - edgeMax) / edgeMin);
        
            if(vUv.y < edgeMin){ // 3
                gl_FragColor.a = (min(vUv.y / edgeMin, xNormal)) * opacity;
            }
            else if(vUv.y >= edgeMin && vUv.y <= edgeMax){ // 6
                gl_FragColor.a = (xNormal) * opacity;
            }
            else if(vUv.y > edgeMax){ // 9
                gl_FragColor.a = (min(xNormal, 1.0 - ((vUv.y - edgeMax) / edgeMin))) * opacity;
            }
      }
    }
`;

const geometry = new THREE.PlaneGeometry(2, 4);

const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const material2 = new THREE.RawShaderMaterial({
    uniforms: UniformsUtils.clone({
        map: { type: "t", value: null },
        edge: { type: "float", value: 0.1 },
        opacity: { type: "float", value: 1 },
    }),
    transparent: true,
    opacity: 1,
    alphaTest: 1,
    depthTest: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});

const cube = new THREE.Mesh(geometry, material1);
const rect = new THREE.Mesh(geometry, material2);
cube.position.set(-2, 0, 0);
rect.position.set(0, 0, 0);

scene.add(rect);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=effectComposer&id=EdgeBlurringEffect) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [后期处理目录](/examples/three/effectComposer/)

> 后期处理 · Three.js
