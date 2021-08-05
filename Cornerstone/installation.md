# 安装

## Direct Download / CDN
[Unpkg.com](https://unpkg.com/cornerstone-core)提供基于NPM的CDN链接。此链接将始终指向NPM的最新版本。您还可以通过网址使用特定的版本/标签`https://unpkg.com/cornerstone-core@2.0.0`。
```html
<script src="/path/to/cornerstone.js"></script>
```

## NPM
```bash
npm install cornerstone-core --save
```

与模块系统一起使用时，可以这样导入`cornerstone`：
```javascript
import * as cornerstone from 'cornerstone-core'
```
使用script全局脚本引入时候，不需要使用引入

## 开发构建
`cornerstone`如果要使用最新的dev构建，则必须直接从GitHub克隆并自行构建

```bash
git clone https://github.com/cornerstonejs/cornerstone.git node_modules/cornerstone
cd node_modules/cornerstone
npm install
npm run build
```