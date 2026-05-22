---
title: "终末地-登录入口 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`、`render`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,终末地-登录入口,游戏复刻"
outline: deep
---

# 终末地-登录入口

*EndField Index*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdIndex)


![终末地-登录入口](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/zmdIndex.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `tick`、`render`。

> 游戏复刻 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

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
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

// 渲染流程
// 1. 渲染模型到 rt_model
// 2. 渲染场景到 rt_scene
// 3. 应用噪声偏移采样点，采样获取模型深度（实现故障效果）
// 4. 采样获取场景深度
// 5. 深度比较，对模型部分应用特殊材质，场景部分正常输出

const setting = {
  baseClearColor: 0xfafafa,
  baseClearAlpha: 1,
};

const rt_model = new THREE.RenderTarget();
rt_model.depthTexture = new THREE.DepthTexture();
const rt_scene = new THREE.RenderTarget();
rt_scene.depthTexture = new THREE.DepthTexture();

// 模型材质，渲染深度用做遮罩图
// 骨骼绑定具体参考 Three.js 着色器 skin
const model_mat = new THREE.ShaderMaterial({
  vertexShader:
```

### glsl

```js
`
    uniform mat4 bindMatrix;
    uniform mat4 bindMatrixInverse;

    uniform highp sampler2D boneTexture;

    mat4 getBoneMatrix(const in float i) {
      int size = textureSize(boneTexture, 0).x;
      int j = int(i) * 4;
      int x = j % size;
      int y = j / size;
      vec4 v1 = texelFetch(boneTexture, ivec2(x + 0, y), 0);
      vec4 v2 = texelFetch(boneTexture, ivec2(x + 1, y), 0);
      vec4 v3 = texelFetch(boneTexture, ivec2(x + 2, y), 0);
      vec4 v4 = texelFetch(boneTexture, ivec2(x + 3, y), 0);
      return mat4(v1, v2, v3, v4);
    }

    void main() {
      vec3 pos = position;

      mat4 boneMatX = getBoneMatrix(skinIndex.x);
      mat4 boneMatY = getBoneMatrix(skinIndex.y);
      mat4 boneMatZ = getBoneMatrix(skinIndex.z);
      mat4 boneMatW = getBoneMatrix(skinIndex.w);

      vec4 skinVertex = bindMatrix * vec4(pos, 1.0);

      vec4 skinned = vec4(0.0);
      skinned += boneMatX * skinVertex * skinWeight.x;
      skinned += boneMatY * skinVertex * skinWeight.y;
      skinned += boneMatZ * skinVertex * skinWeight.z;
      skinned += boneMatW * skinVertex * skinWeight.w;

      pos = (bindMatrixInverse * skinned).xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader:
```

### glsl

```js
`
    void main() {
      gl_FragColor = vec4(1.0);
    }
  `,
});

// 融合管线，合并模型和场景并着色
const pass_mix = new FullScreenQuad(
  new THREE.ShaderMaterial({
    uniforms: {
      t_model: {
        value: rt_model.texture,
      },
      t_modelDepth: {
        value: rt_model.depthTexture,
      },
      t_scene: {
        value: rt_scene.texture,
      },
      t_sceneDepth: {
        value: rt_scene.depthTexture,
      },
      time: {
        value: 0.0,
      },
      // 故障效果强度
      faultStrength: {
        value: 1.0,
      },
      // 是否启用条纹效果
      useStripe: {
        value: true,
      },
    },
    vertexShader:
```

