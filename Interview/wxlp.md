# 小程序架构设计

# 小程序运行环境
| 平台 | 视图层 | 逻辑层 |
| --- | --- | --- |
| iOS | iOS12/13: WKWebview<br/>其他:     | JavaScriptCore |
| Android | 基于Mobile Chrome的自研XWeb引擎  | V8 |
| 开发者工具 | Chromium Webview渲染 | NW.js |
差异问题解决情况:
* **JavaScript差异**: 语法差异可以通过ES6转ES5规避；小程序基础库还内置了必要的Polyfill用以弥补API的差异
* **WXSS渲染差异**: 通过开启样式补全来规避大部分问题，但还是需要在iOS和Andorid上分别检查真是情况