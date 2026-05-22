---
title: "粒子效果的行星 - Three.js 案例讲解"
description: "主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `pushShift`。"
head:
  - - meta
    - name: keywords
      content: "three.js,粒子效果的行星"
outline: deep
---

# 粒子效果的行星

*Planet*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=particle&id=PlanetParticle)


![粒子效果的行星](https://z2586300277.github.io/three-cesium-examples/threeExamples/particle/PlanetParticle.jpg)


## 效果说明

主要靠自定义 shader 出效果，看 uniform 和 GLSL 主逻辑。主流程在 `pushShift`。

> 粒子 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 点精灵/粒子：`Points` + `PointsMaterial`，或自定义 shader 控 size/颜色。

## 代码结构

- 0.5 + 0.5

## 源码

```js
<!DOCTYPE html><html lang="en"><head>
    <title>three.js</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
 
  </head>
  <body>

    <script type="importmap">
        {
          "imports": {
            "three": "https://threejs.org/build/three.module.js",
            "three/addons/": "https://threejs.org/examples/jsm/"
          }
        }
      </script>

    <script type="module">
      import * as THREE from "three";
      import { OrbitControls } from "three/addons/controls/OrbitControls.js";
      let scene = new THREE.Scene();
      scene.background = new THREE.Color(0x160016);
      let camera = new THREE.PerspectiveCamera(
        60,
        innerWidth / innerHeight,
        1,
        1000
      );
      camera.position.set(0, 4, 100);
      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(innerWidth, innerHeight);
      document.body.appendChild(renderer.domElement);
      window.addEventListener("resize", (event) => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      });

      let controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;

   
```

```js
/* * 0.5 + 0.5*/ );`
            );
        },
      });
      let p = new THREE.Points(g, m);
      p.rotation.order = "ZYX";
      p.rotation.z = 0.2;
      scene.add(p);

      let clock = new THREE.Clock();

      renderer.setAnimationLoop(() => {
        controls.update();
        let t = clock.getElapsedTime() * 0.5;
        gu.time.value = t * Math.PI;
        p.rotation.y = t * 0.05;
        renderer.render(scene, camera);
      });
    </script> 

  </body>

</html>
```

