---
title: "骨骼动画 - Three.js 案例讲解"
description: "手工 SkinnedMesh + Bone 层级，SkeletonHelper 可视化骨骼"
head:
  - - meta
    - name: keywords
      content: "three.js,SkinnedMesh,Bone,Skeleton,骨骼"
outline: deep
---

# 骨骼动画

*Skeleton Bone*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=basic&id=skeletonBone)

## 你将学到什么

- **Bone → Skeleton → SkinnedMesh** 底层结构（非 glTF 导入）
- **skinIndex / skinWeight** 顶点绑骨
- **SkeletonHelper** 显示骨骼线框

## 效果说明

Three.js 官方骨骼示例简化版：手工创建骨骼层级与蒙皮网格，GUI 可开关 **animateBones** 旋转关节。

## 核心概念

```
Bone (parent-child 链)
  ↓
Skeleton(bones, boneInverses)
  ↓
SkinnedMesh(geometry, material) + bind(skeleton)
  ↓
geometry.attributes.skinIndex / skinWeight
```

理解此结构后，glTF 骨骼动画（[modelAnimation](/examples/three/basic/modelAnimation)）的 `AnimationMixer` 只是在驱动这些 Bone 的 matrix。

## 小结

- 上一篇：[截图](/examples/three/basic/screenShot) · 下一篇：[视图辅助](/examples/three/basic/viewHelper)

> 基础案例 · Three.js · 26/35
