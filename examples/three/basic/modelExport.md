---
title: "模型导出 - Three.js 案例讲解"
description: "GLTFExporter 将 Scene 导出为 glb/gltf 文件下载"
head:
  - - meta
    - name: keywords
      content: "three.js,GLTFExporter,模型导出,glb"
outline: deep
---

# 模型导出

*GLTF Export*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=modelExport)

## 你将学到什么

- **GLTFExporter.parse** 导出场景
- `{ binary: true }` → **glb**；否则 gltf JSON
- `embedImages: true` 内嵌贴图

## 效果说明

加载 house.obj，点击「导出模型」下载 **scene.glb**。

```js
exporter.parse(scene, (result) => {
    const blob = result instanceof ArrayBuffer
        ? new Blob([result], { type: 'model/gltf-binary' })
        : new Blob([JSON.stringify(result)], { type: 'model/gltf+json' });
    // download blob...
}, { binary: true, onlyVisible: true, embedImages: true });
```

## 小结

- 编辑器「另存为 glTF」同款 API
- 上一篇：[渲染器配置](/examples/three/basic/effectComposer) · 下一篇：[文件分片](/examples/three/basic/fileChunks)

> 基础案例 · Three.js · 33/35
