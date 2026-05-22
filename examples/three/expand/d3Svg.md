---
title: "D3 svg与Three - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。"
head:
  - - meta
    - name: keywords
      content: "three.js,webgl,expand,D3 svg与Three"
outline: deep
---
# D3 svg与Three

*D3 SVG Three*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=d3Svg)

![D3 svg与Three](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/d3Svg.jpg)

## 你将学到什么

- 相机交互控制器
- requestAnimationFrame 渲染循环

## 效果说明

Three.js 接第三方库或扩展能力。

> 扩展功能 · Three.js

## 核心概念

- **OrbitControls** 轨道旋转缩放；开 `enableDamping` 时每帧需 `controls.update()`。

## 实现步骤

1. 搭建 Scene / Camera / Renderer 与 OrbitControls
2. rAF 循环中 update 并 render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as d3 from "d3";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

animate()

function animate() {

  requestAnimationFrame(animate)

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

const data = await d3.json(FILE_HOST + "other/volcano.json");
const n = data.width;
const m = data.height;
const width = 928;
const height = Math.round(m / n * width);
const path = d3.geoPath().projection(d3.geoIdentity().scale(width / n));
const contours = d3.contours().size([n, m]);
const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(data.values)).nice();

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

svg.append("g")
  .attr("stroke", "black")
  .selectAll()
  .data(color.ticks(20))
  .join("path")
  .attr("d", d => path(contours.contour(data.values, d)))
  .attr("fill", color);

const div = document.createElement('div');
div.style.position = 'absolute';
div.style.width = '300px';
div.appendChild(svg.node());
document.body.appendChild(div);

const svgString = new XMLSerializer().serializeToString(svg.node());

const svgData = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(svgData);

const loader = new SVGLoader();

loader.load(
  url,
  function (data) {
    const paths = data.paths;
    const group = new THREE.Group();

    // 过滤和清理路径数据
    const filteredPaths = paths.filter(path =>
      path.subPaths && path.subPaths.length > 0
    );

    filteredPaths.forEach((path, index) => {

      let pathColor = 0x00ff00; // 默认绿色

      if (path.userData && path.userData.style) {
        const fillMatch = path.userData.style.fill;
        if (fillMatch && fillMatch !== 'none') pathColor = fillMatch;
      }

      const material = new THREE.MeshBasicMaterial({
        color: pathColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });

      const shapes = SVGLoader.createShapes(path);

      shapes.forEach(shape => {
        const geometry = new THREE.ShapeGeometry(shape);
        geometry.computeBoundingBox();
        const center = geometry.boundingBox.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -center.y, 0);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, index * 0.1); // 轻微分层避免z-fighting
        mesh.scale.setScalar(0.1); // 适当缩放
        group.add(mesh);
      });
    });

// ... 完整源码见在线案例编辑器
```

## 小结

- 建议先在 [案例编辑器](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=d3Svg) 运行，再对照源码逐步修改参数加深理解
- 更多同类案例见 [扩展功能目录](/examples/three/expand/)

> 扩展功能 · Three.js
