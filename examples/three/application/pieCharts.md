---
title: "3D饼图 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `createPieBlock`。"
head:
  - - meta
    - name: keywords
      content: "three.js,3D饼图"
outline: deep
---

# 3D饼图

*3D Pie*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=pieCharts)


![3D饼图](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/pieCharts.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `createPieBlock`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- opacity: 0.7,transparent: true,depthWrite: false,

## 源码

```js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// 创建渲染器
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
// 设置canvas画布大小为窗口
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio * 2); // 设置像素比
document.body.appendChild(renderer.domElement); // canvas画布插入dom树

// 创建场景
var scene = new THREE.Scene();

// 辅助线
var axisHelper = new THREE.AxesHelper(500);
scene.add(axisHelper);

// 添加点光源
let light1 = new THREE.PointLight("#fff", 3, 0, 0);
light1.position.set(0, 1160, 2160);
scene.add(light1);

//环境光
let ambient = new THREE.AmbientLight("#fff", 0.6);
scene.add(ambient);

// 创建相机
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 4000);
camera.position.set(70, 230, 230); // 设置相机位置

// 创建控制器
let controls = new OrbitControls(camera, renderer.domElement);

// 渲染
!(function render() {
  controls.update(); // Update controls
  renderer.render(scene, camera);
  requestAnimationFrame(render);
})();

// 字体加载器
const fontUrl = FILE_HOST + 'files/json/font.json'
new FontLoader().load(fontUrl, function (font) {

```

### opacity: 0.7,
  transparent: true,
  depthWrite: false,

```js
});
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    // 创建文字
    const textGeometry = new TextGeometry(rateText, {
      font: font,
      size: 18,
      depth: 5.5,
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: color });
    const text = new THREE.Mesh(textGeometry, textMaterial);

    // 旋转
    text.rotateX((Math.PI / 180) * 90);
    //text.rotateY((Math.PI / 180) * (startAngle + angleLength / 2 - 90));
    text.updateMatrix(); // 更新矩阵

    // 包围盒
    textGeometry.computeBoundingBox();
    const { max, min } = textGeometry.boundingBox;
    // 包围盒中心
    const textCenter = new THREE.Vector3((max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2);
    textCenter.applyMatrix4(text.matrix.clone());
    // 目标位置
    const targetPostion = new THREE.Vector3(
      Math.cos((Math.PI / 180) * (startAngle + angleLength / 2)) * (innerR + (outR - innerR) / 2),
      Math.sin((Math.PI / 180) * (startAngle + angleLength / 2)) * (innerR + (outR - innerR) / 2),
      h + 30
    );
    // 移动
    text.position.add(targetPostion.sub(textCenter));
    mesh.add(text);
  }

  !(function h() {
    if (angleLength1 >= 230) return (controls.autoRotate = true);
    setTimeout(() => {
      h();
    }, 50);
    const arr = [...group.children];
    arr.forEach((obj) => {
      group.remove(obj);
    })
```

