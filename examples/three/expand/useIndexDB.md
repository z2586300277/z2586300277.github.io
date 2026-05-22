---
title: "IndexedDB使用 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。主流程在 `animate`、`GLB_table`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,IndexedDB使用,扩展功能"
outline: deep
---

# IndexedDB使用

*Use IndexDB*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=useIndexDB)


![IndexedDB使用](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/useIndexDB.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。主流程在 `animate`、`GLB_table`。

> 扩展功能 · Three.js

## 实现思路

- 外部模型 glTF/FBX 用对应 Loader，`scene.add(gltf.scene)` 后注意 scale/坐标。

- 轨道控制：`OrbitControls(camera, domElement)`，阻尼 `enableDamping` 要每帧 `update()`。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

## 代码结构

- 获取表

## 独立函数

- `animate()` — rAF：update controls + render

## 源码

```js
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Open Three</title>
  <script type="importmap">
{
    "imports": {
        "three": "https://threejs.org/build/three.module.min.js",
        "three/examples/jsm/": "https://threejs.org/examples/jsm/"
    }
}
</script>
  <style>
    body {
      margin: 0;
      padding: 1px;
      box-sizing: border-box;
      background-color: #1f1f1f;
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
    }

    #box {
      width: 100%;
      height: 100%;
    }

    .panel {
      width: 400px;
      height: auto;
      position: absolute;
      z-index: 100;
      top: 0;
      left: 50;
      color: #fff;
    }

    table {
      color: #fff;
    }
  </style>
</head>

<body>
  <div id="box"></div>
  <div class="panel">
    <button onclick="getAll()">查询存储表</button>
    <table>
      <tbody>
        <tr>
          <td>LittlestTokyo.glb</td>
          <td><button onclick="insert('LittlestTokyo.glb')">插入indexDB</button></td>
          <td><button onclick="del('LittlestTokyo.glb')">删除</button></td>
          <td><button onclick="load('LittlestTokyo.glb')">加载存储模型</button></td>
        </tr>
        <tr>
          <td>Soldier.glb</td>
          <
```

### 获取表

```js
window.getAll = () => {

      const searchAll = GLB_table().getAll()

      searchAll.onsuccess = event => {

        const { result } = searchAll

        alert('获取数据成功------' + result.length + '个——' + result.map(k => k.name).join(','))

      }

    }
```

### 插入

```js
window.insert = (name) => {

      const url = 'https://z2586300277.github.io/3d-file-server/files/model/' + name

      fetch(url).then(response => response.blob()).then(blob => {

        const setRequest = GLB_table().put({ name, blob })

        setRequest.onsuccess = () => alert(name + '存储成功')

      })

    }
```

