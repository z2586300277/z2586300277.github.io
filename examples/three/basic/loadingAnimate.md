---
title: "加载动画 - Three.js 案例讲解"
description: "LoadingManager 总进度、GLTFLoader xhr 下载进度与 DOM 加载提示"
head:
  - - meta
    - name: keywords
      content: "three.js,LoadingManager,加载进度,GLTFLoader"
outline: deep
---

# 加载动画

*Loading Progress*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=loadingAnimate)

![加载动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/loadingAnimate.jpg)

## 你将学到什么

- **LoadingManager** 管理多资源总进度
- **GLTFLoader.load** 第三个参数 xhr 下载进度
- 两层进度：**下载 %** 与 **解析/导入 %**

## 效果说明

加载 `LittlestTokyo.glb` 大场景时，屏幕中央浮层显示 **「下载 xx%」** 与 **「导入 xx%」**，完成后显示「加载完成」。

## 核心概念

### LoadingManager 回调

```js
const manager = new THREE.LoadingManager();
manager.onStart = (url, loaded, total) => { /* 开始 */ };
manager.onProgress = (url, loaded, total) => { /* 总进度 */ };
manager.onLoad = () => { /* 全部完成 */ };
manager.onError = (url) => { /* 失败 */ };

const loader = new GLTFLoader(manager);
```

传入 Manager 后，Loader 内部加载的 **纹理、bin 等子资源** 都会计入 `onProgress`。

### xhr 下载进度

```js
loader.load(url, onLoad, (xhr) => {
    const pct = (xhr.loaded / xhr.total * 100).toFixed(2);
    // 仅反映网络下载，不含 GPU 解析
});
```

| 阶段 | 回调 | 含义 |
|------|------|------|
| 下载 | load 的第 3 参数 xhr | 字节流进度 |
| 导入 | manager.onProgress | 含纹理解析等 |

本案例 **两者同时显示**，用户体验更完整。

## 源码

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const loadingDiv = document.createElement('div')
loadingDiv.innerText = '加载中...'
Object.assign(loadingDiv.style, {
    pointerEvents: 'none', position: 'fixed', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)', color: 'white', fontSize: '20px',
    backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '5px'
})
document.body.appendChild(loadingDiv)

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)
camera.position.set(0, 400, 400)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
scene.add(new THREE.AmbientLight(0xffffff, 3))

const manager = new THREE.LoadingManager()
manager.onStart = () => { loadingDiv.innerText = '开始加载' }
manager.onLoad = () => { loadingDiv.innerHTML = '加载完成' }
manager.onProgress = (url, loaded, total) => {
    loadingDiv.innerText = '导入' + (loaded / total * 100).toFixed(2) + '%'
}

const loader = new GLTFLoader(manager)
loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))
loader.load(
    FILE_HOST + '/files/model/LittlestTokyo.glb?time=' + new Date().getTime(),
    gltf => { scene.add(gltf.scene) },
    xhr => { loadingDiv.innerText = '下载' + (xhr.loaded / xhr.total * 100).toFixed(2) + '%' }
)

function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}
animate()
```

## 小结

- 生产环境：`LoadingManager` + 自定义 Progress UI（本案例为简易 div）
- 上一篇：[Opt解压](/examples/three/basic/gltfOptLoader) · 下一篇：[轮廓光](/examples/three/basic/outlinePass)

> 基础案例 · Three.js · 10/35
