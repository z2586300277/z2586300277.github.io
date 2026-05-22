---
title: "人物虚化 - Three.js 案例讲解"
description: "Three.js 场景效果。主流程在 `tick`、`render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,人物虚化,游戏复刻"
outline: deep
---

# 人物虚化

*Character Blur*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=characterBlur)


![人物虚化](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/characterBlur.jpg)


## 效果说明

Three.js 场景效果。主流程在 `tick`、`render`。

> 游戏复刻 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 独立函数

- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

const modelUrl = "https://ylfq.github.io/model/walk.fbx";

const canvas = document.createElement("canvas");
canvas.style.width = "100vw !important";
canvas.style.height = "100vh !important";
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0x333333, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();

const loader_fbx = new FBXLoader();

const modelMaterialUniforms = {
  blur: 0.85,
  blockSize: 12.0,
};

const model = await loader_fbx.loadAsync(modelUrl);
model.traverse((obj) => {
  if (obj instanceof THREE.Mesh) {
    obj.castShadow = true;
    obj.receiveShadow = true;

    /** @type {THREE.MeshPhongMaterial} */
    const m = obj.material;
    m.onBeforeCompile = (shader) => {
      shader.uniforms.blur = {
        get value() {
          return modelMaterialUniforms.blur;
        },
      };
      shader.uniforms.blockSize = {
        get value() {
          return modelMaterialUniforms.blockSize;
        },
      };

      shader.fragmentShader = shader.f
```

### glsl

```js
`
          // 虚化阈值
          uniform float blur;
          // 虚化区块大小
          uniform float blockSize;

          // 虚化矩阵，自定义区块内的虚化顺序，当像素对应的虚化矩阵值小于blur时，该像素不进行渲染
          const mat4 blurMatrix = mat4(
            0.1, 0.5, 0.7, 0.3,
            0.6, 0.6, 0.9, 0.8,
            0.8, 1.0, 0.2, 0.6,
            0.3, 0.7, 0.5, 0.4
          );
            
          void main() {
            ivec2 xyInBlur = ivec2(fract(gl_FragCoord.xy / blockSize) * 4.0);
            if (blurMatrix[xyInBlur.y][xyInBlur.x] <= blur) discard;
        `
      );
    };
  }
});
const mixer = new THREE.AnimationMixer(model);
const action = mixer.clipAction(model.animations[0]);
action.setLoop(THREE.LoopRepeat);
action.play();

const light_ambient = new THREE.AmbientLight(0xffffff, 0.7);

const light_directional = new THREE.DirectionalLight(0xffffff, 0.8);
light_directional.position.set(200, 200, 200);
light_directional.castShadow = true;
light_directional.shadow.camera.left = -100;
light_directional.shadow.camera.right = 100;
light_directional.shadow.camera.top = 100;
light_directional.shadow.camera.bottom = -100;
light_directional.shadow.camera.near = 1;
light_directional.shadow.camera.far = 1000;
light_directional.shadow.mapSize.width = 1024;
light_directional.shadow.mapSize.height = 1024;

scene.add(model, light_ambient, light_directional);

const camera =
```

