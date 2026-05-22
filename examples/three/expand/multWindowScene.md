---
title: "多浏览器窗口连接 - Three.js 案例讲解"
description: "Three.js 接第三方库或扩展能力。入口在 `WindowManager`。"
head:
  - - meta
    - name: keywords
      content: "three.js,cesium,webgl,多浏览器窗口连接,扩展功能"
outline: deep
---

# 多浏览器窗口连接

*Mult Window*

[▶ 在线运行案例](https://z2586300277.github.io/three-cesium-examples/#/?navigation=ThreeJS&classify=expand&id=multWindowScene)


![多浏览器窗口连接](https://z2586300277.github.io/three-cesium-examples/threeExamples/expand/multWindowScene.jpg)


## 效果说明

Three.js 接第三方库或扩展能力。入口在 `WindowManager`。

> 扩展功能 · Three.js

## 实现思路

- 手写几何：`BufferGeometry` + `Float32Array` 填 position/uv/normal，`setIndex` 拼三角面。

- 渲染循环在 rAF 里更新 uniform/动画，最后 `renderer.render(scene, camera)`。

- 反射/水面常用 Reflector 或自定义 renderTarget 贴图。

## 类与方法

### WindowManager

- `constructor()` — 初始化成员
- `init()`
- `getWinShape()`
- `getWindowIndexFromId()`
- `updateWindowsLocalStorage()`
- `update()` — 每帧更新 geometry uniform 或实例矩阵
- `setWinShapeChangeCallback()`
- `setWinChangeCallback()`
- `getWindows()`
- `getThisWindowData()`
- `getThisWindowID()`

## 独立函数

- `init()` — Scene / Camera / Renderer 初始化
- `setupWindowManager()` — 移除 Entity / 解绑监听
- `updateNumberOfCubes()` — 移除 Entity / 解绑监听
- `render()` — renderer.render(scene, camera)

## 源码

```js
import * as THREE from 'three'

confirm("是否打开多窗口？")
	?
	window.open(

		HOST + '#/codeMirror?navigation=ThreeJS&classify=expand&id=multWindowScene',

		'_blank',

		`width=800,height=600,left=${Math.random() * 500},top=${Math.random() * 200}`
	) : null

class WindowManager {
	#windows;
	#count = localStorage.getItem("count") || 0;
	#id;
	#winData;
	#winShapeChangeCallback;
	#winChangeCallback;

	constructor() {
		addEventListener("storage", (event) => {
			if (event.key == "windows") {
				let newWindows = JSON.parse(event.newValue);
				let winChange = this.#didWindowsChange(this.#windows, newWindows);
				this.#windows = newWindows;
				if (winChange && this.#winChangeCallback) this.#winChangeCallback();
			}
		});

		window.addEventListener('beforeunload', () => {
			let index = this.getWindowIndexFromId(this.#id);
			this.#windows.splice(index, 1);
			this.updateWindowsLocalStorage();
		});
	}

	#didWindowsChange(pWins, nWins) {
		if (pWins.length != nWins.length) return true;
		return pWins.some((pWin, i) => pWin.id != nWins[i].id);
	}

	init(metaData) {
		this.#windows = JSON.parse(localStorage.getItem("windows")) || [];
		this.#count++;
		this.#id = this.#count;
		let shape = this.getWinShape();
		this.#winData = { id: this.#id, shape: shape, metaData: metaData };
		this.#windows.push(this.#winData);
		localStorage.setIte
```

