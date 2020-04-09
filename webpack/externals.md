## webpack配置之-externals

使用目的：**防止**webpack将某些`import`的包(package)打包到`bundle`中，而是在运行时(runtime)再去从外部获取这些*拓展依赖(external dependencies)*。

什么意思呢？假如说我的React的项目，我可以将`react.js`提前放到CDN上并在我的`入口文件(index.html)`上引入CDN的这个`react.js`文件，然后通过配置(`externals`)后，最终我打包文件时，webpack不会把`react.js`作为依赖一起打包（而是引入CDN上的`react.js`文件）。也就是说可以在项目文件内省略公用代码库的文件，有效减少打包后代码体积。

上述React只是其中一个例子，实际上externals支持各种模块的上下文：CommonJS, AMD, 全局变量与ES2015模块等都支持。(**注意**：`确保打包后的运行环境确实有该依赖包`)

### 基本使用

例如从CDN引入Vue：

第一步：在`index.html`中引入vue的CDN。如果有使用的index.html模板，可以直接在其中插入如下script：



### 支持的配置方式

externals支持5种配置方式：string, array, object, function, regex



