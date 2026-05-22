---
title: "材质修改动画 - Three.js 案例讲解"
description: "traverse 定位子 Mesh 材质，GUI 调 PBR 参数，gsap 平滑改 color"
head:
  - - meta
    - name: keywords
      content: "three.js,材质,MeshStandardMaterial,gsap,GUI"
outline: deep
---

# 材质修改动画

*Material Tweak*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=basic&id=changeMaterial)

![材质修改动画](https://z2586300277.github.io/three-cesium-examples/threeExamples/basic/changeMaterial.jpg)

## 你将学到什么

- `group.traverse` 按 **name** 找到特定部件材质
- **MeshStandardMaterial** 的 wireframe / opacity / metalness / roughness
- **gsap.to(material.color)** 颜色过渡动画

## 效果说明

加载汽车 glb，针对名为 `网格138_3` 的车身部件，GUI 调节线框、透明、金属度等；改颜色时用 **gsap 1.5 秒插值**，避免突变。

## 核心概念

```js
group.traverse(child => {
    if (child.isMesh && child.name === '网格138_3') {
        material = child.material;
        material.envMap = textureCube;  // 天空盒反射
    }
});

// gsap 动画改颜色
folder.addColor({ color: material.color.clone() }, 'color').onChange(c => {
    gsap.to(material.color, { ...c, duration: 1.5 });
});
```

::: tip
glTF 子节点 name 来自建模软件，加载后 `console.log` 或编辑器查看再 traverse。
:::

## 小结

- 运行时改材质 = traverse + GUI；颜色动画用 gsap
- 上一篇：[扩散圈](/examples/three/basic/扩散圈) · 下一篇：[拖拽控制](/examples/three/basic/transformObject)

> 基础案例 · Three.js · 15/35
