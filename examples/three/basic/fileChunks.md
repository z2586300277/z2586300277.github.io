---
title: "文件分片(打包zip) - Three.js 案例讲解"
description: "大 glb 切分为 chunk + JSZip，合并 ArrayBuffer 后 GLTFLoader 加载"
head:
  - - meta
    - name: keywords
      content: "three.js,文件分片,JSZip,大模型上传"
outline: deep
---

# 文件分片（打包 zip）

*File Chunks*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=fileChunks)

## 你将学到什么

- 大文件 **slice 分片** 打包 zip 上传/下载思路
- JSZip 合并 **ArrayBuffer** 还原完整 glb
- `URL.createObjectURL` 临时加载

## 效果说明

选择本地 `.glb` → 均分 5 片写入 zip → 自动下载 `_chunks.zip` → 再解压合并 → **GLTFLoader** 加载进场景。

## 核心概念

```js
for (let i = 0; i * chunkSize < file.size; i++) {
    zip.file(`${i}.chunk`, file.slice(i * chunkSize, (i + 1) * chunkSize));
}
// 还原：按序 async arraybuffer → Uint8Array 拼接 → Blob → loader.load(url)
```

适用于 **超大模型分片上传** 后端再合并；本案例为前端演示全流程。

## 小结

- **基础案例 35/35 已全部精讲完成**
- 下一分类：[着色器](/examples/three/shader/) 或 [Cesium 基础](/examples/cesium/basic/loadModel)

> 基础案例 · Three.js · 35/35 · [基础案例目录](/examples/three/basic/) ✅ 本篇完结
