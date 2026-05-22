---
title: "音乐舞动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,shader,音乐舞动"
outline: deep
---
# 音乐舞动

*Audio Dance*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=audioDance)

![音乐舞动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/audioDance.jpg)

## 你将学到什么

- 自定义 ShaderMaterial / 修改内置 shader
- 相机交互控制器
- 实时阴影 ShadowMap
- requestAnimationFrame 渲染循环
- GUI 面板调试参数

## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。

> 着色器 · Three.js

## 核心概念

- **ShaderMaterial** 完全自定义 GLSL；`onBeforeCompile` 可在内置材质 shader 中注入代码。关注 `uniforms` 与 rAF 更新。

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

- 阴影四步：`renderer.shadowMap.enabled`、光源 `castShadow`、物体 `castShadow`、地面 `receiveShadow`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. 定义材质/shader 与 uniforms，rAF 中更新
3. rAF 循环中 update 并 render

## 代码要点

- **`initOrthographicCamera()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`initRenderer()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读
- **`update()`** — 案例中的独立逻辑模块，建议在线编辑器中跳转阅读

## 源码

```js
import {
  Vector3,
  Mesh,
  BoxGeometry,
  Color,
  WebGLRenderer,
  PCFSoftShadowMap,
  OrthographicCamera,
  ShaderMaterial,
  Scene,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

function initOrthographicCamera(initialPosition) {
  const s = 15;
  const h = window.innerHeight;
  const w = window.innerWidth;
  const position =
    initialPosition !== undefined ? initialPosition : new Vector3(-30, 40, 30);

  const camera = new OrthographicCamera(
    -s,
    s,
    s * (h / w),
    -s * (h / w),
    1,
    10000
  );
  camera.position.copy(position);
  camera.lookAt(new Vector3(0, 0, 0));

  window.camera = camera;

  return camera;
}
function initRenderer(props = {}) {
  const dom = document.getElementById("box");
  dom.style.width = "100vw";
  dom.style.height = "100vh";

  const renderer = new WebGLRenderer({ antialias: true, ...props });
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(dom.offsetWidth, dom.offsetHeight);

  dom.appendChild(renderer.domElement);
  window.renderer = renderer;

  return renderer;
}

window.onload = () => {
  init();
};

const colors = [
  new Color(0.5, 0.0, 1.0), // 紫色
  new Color(0.0, 0.0, 1.0), // 蓝色
  new Color(0.0, 1.0, 1.0), // 青色
  new Color(0.0, 1.0, 0.0), // 绿色
  new Color(1.0, 1.0, 0.0), // 黄色
  new Color(1.0, 0.0, 0.0), // 红色
];

const vertexShader = /*glsl*/ `
    varying vec4 vPosition;
    void main() {
      vPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

const fragmentShader = /*glsl*/ `
    varying vec4 vPosition;
    uniform float uScale;
    uniform vec3 colors[6];
    void main() {
      float intensity = clamp((vPosition.y + 13.0) * uScale / 255.0, 0.0, 1.0);
  
      float segment = intensity * 5.0;
      int index = int(segment);
      float t = fract(segment);
  
      vec3 outputColor  = mix(colors[index], colors[index + 1], t);
      gl_FragColor = vec4(outputColor , 1.0);
    }
  `;

function init() {
  const renderer = initRenderer();

  const camera = initOrthographicCamera(new Vector3(0, 0, 100));
  camera.lookAt(0, 0, 0);
  camera.up.set(0, 0, 1);
  camera.zoom = 0.4;
  camera.updateProjectionMatrix();

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  const scene = new Scene()

  const bars = [];
  const barCount = 64;
  const geometry = new BoxGeometry(0.5, 1, 0.5);
  const material = new ShaderMaterial({
    uniforms: {
      colors: { value: colors },
      uScale: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  for (let i = 0, offset = 0; i < barCount; i++, offset = i - barCount / 2) {
    const bar = new Mesh(geometry, material.clone());
    bar.position.x = offset;
    scene.add(bar);
// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=audioDance) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [着色器目录](/examples/three/shader/)

> 着色器 · Three.js
