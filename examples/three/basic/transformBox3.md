---
title: "变换Box3 - Three.js 案例讲解"
description: "Box3.setFromObject 包围盒，Box3Helper 随 TransformControls 实时更新"
head:
  - - meta
    - name: keywords
      content: "three.js,Box3,Box3Helper,包围盒,TransformControls"
outline: deep
---

# 变换 Box3

*Box3 Helper*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=transformBox3)

![变换Box3](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/transformBox3.jpg)

## 你将学到什么

- **Box3.setFromObject** 计算物体世界空间 AABB
- **Box3Helper** 可视化黄色包围盒
- TransformControls `change` 事件驱动包围盒刷新

## 效果说明

Fox 模型挂载 TransformControls，拖拽时 **黄色线框包围盒** 跟随更新，直观看到物体占用空间。

## 核心概念

```js
const box3 = new THREE.Box3();
const box3Helper = new THREE.Box3Helper(box3, 0xffff00);
scene.add(box3Helper);

transformControls.addEventListener('change', () => {
    box3Helper.box = box3.setFromObject(transformControls.object);
});
```

**AABB**（轴对齐包围盒）不随物体旋转而旋转，始终与世界轴平行，适合碰撞粗测、视图 fit。

## 小结

- 包围盒 = `Box3.setFromObject` + `Box3Helper`
- 上一篇：[拖拽控制](/examples/three/basic/transformObject) · 下一篇：[单/多模型动画](/examples/three/basic/modelAnimates)

> 基础案例 · Three.js · 17/35
