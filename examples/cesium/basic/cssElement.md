---
title: "CSS 元素 - Cesium.js 案例讲解"
description: "postRender + worldToWindowCoordinates 将 HTML DOM 钉在地理坐标"
head:
  - - meta
    - name: keywords
      content: "cesium.js,CSS2D,DOM,postRender,worldToWindowCoordinates"
outline: deep
---

# CSS 元素

*CSS DOM Overlay*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=CesiumJS&classify=basic&id=cssElement)

![CSS 元素](https://z2586300277.github.io/three-cesium-examples/cesiumExamples/basic/cssElement.jpg)

## 你将学到什么

- 不用 Entity，用 **原生 HTML** 做信息面板
- **postRender** 每帧把世界坐标投影到屏幕像素
- **SceneTransforms.worldToWindowCoordinates** 坐标转换
- 背面/过远时隐藏 DOM

## 效果说明

北京坐标处有一个可点击的蓝色边框 div「2dDOM」，随相机移动始终钉在地标上方；过远或转到地球背面时自动隐藏。

## 核心概念

Cesium 内置 **HtmlOverlay / InfoBox** 等方案；本案例演示 **最小自实现**：

```
地理坐标 (Cartesian3)
    ↓ worldToWindowCoordinates
屏幕像素 (x, y)
    ↓ CSS transform: translate
DOM 定位
```

### 容器层级

```js
const css2dContainer = document.createElement('div');
Object.assign(css2dContainer.style, {
    position: 'absolute', top: '0', left: '0',
    pointerEvents: 'none',  // 容器穿透，子元素可单独开启
    zIndex: '1',
});
box.appendChild(css2dContainer);
```

### postRender 同步

```js
viewer.scene.postRender.addEventListener(() => {
    const windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(
        viewer.scene, position
    );
    if (windowCoord) {
        DOM.style.transform = `translate(${windowCoord.x}px, ${windowCoord.y - offsetHeight}px)`;
    }
    // 距离过远则隐藏
    const maxDistance = ...;
    DOM.style.display = distance > maxDistance ? 'none' : 'block';
});
```

::: tip 与 Three.js CSS2DRenderer 对比
思路相同：每帧投影 + translate。Cesium 需自己算 `maxDistance` 处理背面。
:::

## 实现步骤

1. 在 Viewer 容器外再套一层 `css2dContainer`
2. 创建样式化 div，设置 `pointerEvents: 'all'` 以响应点击
3. `setCss2dDom(viewer, DOM, [lon, lat, height])` 注册 postRender
4. 返回 destroy 函数：移除 DOM 并取消监听

## 代码要点

```js
function setCss2dDom(viewer, DOM, position) {
    if (!(position instanceof Cesium.Cartesian3))
        position = Cesium.Cartesian3.fromDegrees(...position);

    css2dContainer.appendChild(DOM);
    const destroy = viewer.scene.postRender.addEventListener(() => {
        const windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(
            viewer.scene, position
        );
        if (windowCoord) {
            DOM.style.transform = `translate(${windowCoord.x}px, ${windowCoord.y - DOM.offsetHeight}px)`;
        }
    });
    return () => { css2dContainer.removeChild(DOM); destroy(); };
}
```

## 源码

完整源码见 [GitHub](https://github.com/z2586300277/three-cesium-examples/blob/dev/cesiumExamples/basic/cssElement.js)。

## 小结

- 复杂 UI（表单、图表）用 DOM  overlay；纯文字用 Entity.label 更轻
- 上一篇：[绘制文字](/examples/cesium/basic/cesiumText) · 下一篇：[点击事件](/examples/cesium/basic/clickEvent)

> 基础功能 · Cesium.js · 5/19
