---
title: "球体文字 - Three.js 案例讲解"
description: "Three.js 业务向场景组合。主流程在 `animate`。"
head:
  - - meta
    - name: keywords
      content: "three.js,球体文字"
outline: deep
---

# 球体文字

*Text Sphere*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=application&id=textSphere)


![球体文字](https://z2586300277.github.io/three-cesium-examples/threeExamples/application/textSphere.jpg)


## 效果说明

Three.js 业务向场景组合。主流程在 `animate`。

> 应用场景 · Three.js

## 实现思路

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 字体大小
- 文本厚度
- 曲线点数 (5降低优化性能)
- 斜角深度

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const DOM = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)
camera.position.set(1, 2, 3)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(DOM.clientWidth, DOM.clientHeight)
DOM.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.01

animate()
function animate() {
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

window.onresize = () => {
    renderer.setSize(DOM.clientWidth, DOM.clientHeight)
    camera.aspect = DOM.clientWidth / DOM.clientHeight
    camera.updateProjectionMatrix()
}

scene.add(new THREE.AxesHelper(1000))

scene.add(new THREE.AmbientLight(0x404040, 5));

let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.castShadow = true;
directionalLight.position.set(0, 50, 0);

scene.add(directionalLight);

const TEXT = [
    "thr
```

### 斜角偏移

```js
,
    });

    // 计算文本几何体的边界框
    textGeometry.computeBoundingBox();

    if (textGeometry) {
        // 根据文本几何体计算布局位置
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
        const textCenterX = -textWidth / 2;
        const textCenterY = -textHeight / 2;
        // 平移到球体表面
        textGeometry.translate(textCenterX, textCenterY, 0);

        // 创建文本网格
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 使用基础材质
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // 获取球体表面的法线向量
        const normal = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
        // 将文本网格平移到球体表面
        textMesh.position.copy(normal.multiplyScalar(radius));

        // 调整文字朝向球心
        textMesh.lookAt(new THREE.Vector3(pos.x * 2, pos.y * 2, pos.z * 2));

        const isClose = savePos.some(
            (p) => p.distanceTo(textMesh.position) <= 0.8
        );
        // 根据距离调整密度因子
        if (!isClose) {
            // 将文本网格添加到球体上
            sphere.add(textMesh);
            // 存储文本网格到数组中
            textMeshes.push(textMesh);
            savePos.push(textMesh.position);
        }
    }
}
```

