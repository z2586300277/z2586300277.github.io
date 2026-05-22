---
title: "终末地-登录入口 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,game,终末地-登录入口"
outline: deep
---
# 终末地-登录入口

*EndField Index*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdIndex)

![终末地-登录入口](https://z2586300277.github.io/three-cesium-examples/threeExamples/game/zmdIndex.jpg)

## 你将学到什么

- AnimationMixer 骨骼动画播放与过渡
- glTF/FBX/OBJ 外部模型加载
- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 点云 / 粒子 / 实例化渲染

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 游戏复刻 · Three.js

## 核心概念

- **AnimationMixer** 驱动 glTF 骨骼动画；每帧 `mixer.update(delta)`。动作切换可用 `crossFadeTo` 平滑过渡。

- **Loader** 异步加载模型；glTF 返回 `gltf.scene`，加载后注意 `scale` 与坐标系。Draco 需配置 `DRACOLoader`。

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. Loader 异步加载模型/纹理资源
3. 定义材质/shader 与 uniforms，rAF 中更新
4. rAF 循环中 update 并 render

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
  vertexShader: /* glsl */ `
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
  fragmentShader: /* glsl */ `
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
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform  sampler2D  t_model        ;
      uniform  sampler2D  t_modelDepth   ;
      uniform  sampler2D  t_scene        ;
      uniform  sampler2D  t_sceneDepth   ;
      uniform  float      time           ;
      uniform  float      faultStrength  ;
      uniform  bool       useStripe      ;

      // RGBA深度解包，具体参考 Three.js 着色器 packing
      const float UnpackDownscale = 255.0 / 256.0;
      const vec4 PackFactors = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
      const vec4 UnpackFactors4 = vec4(UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a);
      float unpackRGBAToDepth(const in vec4 v) {
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=game&id=zmdIndex) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [游戏复刻目录](/examples/three/game/)

> 游戏复刻 · Three.js
