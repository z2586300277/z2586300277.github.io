---
title: "音乐舞动 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initOrthographicCamera`、`initRenderer`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,音乐舞动,着色器"
outline: deep
---

# 音乐舞动

*Audio Dance*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=shader&id=audioDance)


![音乐舞动](https://z2586300277.github.io/three-cesium-examples/threeExamples/shader/audioDance.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `initOrthographicCamera`、`initRenderer`。

> 着色器 · Three.js

## 实现思路

- 自定义着色器：`ShaderMaterial` 自带 projectionMatrix/modelViewMatrix；`RawShaderMaterial` 全部 uniform 自己传。片元里改 gl_FragColor 或对接 PBR。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- glsl

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `update()` — 材质 / GLSL
- `render()` — renderer.render(scene, camera)

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
  ne
```

### glsl

```js
`
    varying vec4 vPosition;
    void main() {
      vPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

const fragmentShader =
```

### glsl

```js
`
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
    bars.push(bar);

    const mirrorBar = new Mesh(geometry, material.clone());
    mirrorBar.position.x = -offset;
    scene.add(
```

