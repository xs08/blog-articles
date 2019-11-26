# webpack4 配置React开发环境

重拾React的开发，需要配置下环境。按步骤一步一步来。

1. 第一步，新建开发项目目录，如**react-fonfig**，并切换到该目录下。然后使用`npm init`初始化项目。可以自行配置项目名、维护者信息等。

2. 安装*webpack*，*webpack-cli*等，基本安装。`npm i -D webpack webpack-cli` 。(webpack4安装需要安装_webapck-cli_)。

   项目根目录新建**webpack.config.js**, 添加*entry*，*output*等基本配置。

   ~~~javascript
   const webpack = require('webpack')
   const path = require('path')
   
   // 打包后文件位置
   const distDir = path.resolve(__dirname, 'dist')
   
   module.export = {
     entry: {
       app: path.resolve(__dirname, './src/app.js')
     },
     output: {
       filename: '[name].[hash].js',
       path: distDir
     },
     resolve: {
       // 配置解析文件拓展名
       extensions: ['*', '.js', '.jsx']
     }
   }
   ~~~

3. 修改**package.json**，添加构建命令：

   ~~~json
   // ...修改前
   "scripts": {
       "test": "初始化的配置"
   }
   
   // 修改后. mode: development || production, webpack4会根据mode自行进行优化。colors：显示颜色，progress：显示进度
   "script": {
   	"builed": "webpack --mode production --colors --progress"
   }
   ~~~

4. 安装*babel*转码*ES6*和*ES6*等，`npm i -D @babel/core babel-loader @babel/preset-env @babel/preset-react`。**@babel/preset-env**配置解析ES6等，**@babel/preset-react**解析react，jsx等

   （1）配置**.babelrc**

   ~~~json
   {
   	"preset": ["@babel/preset-env", "@babel/preset-react"]
   }
   ~~~

   （2）配置**webpack.config.js**

   ~~~javascript
   // 上面已有的省略
   module: {
       rules: [
         {
           test: /\.(js|jsx)$/,
           exclude: /node_modules/,
           use: {
             loader: "babel-loader"
           }
         }
      ]
   }
   ~~~

5. 配置*React*开发热替换。安装*webpack-dev-server*，*react-hot-loader*等，`npm i -D webpad-dev-server react-hot-loader`。

   （1）修改**webpack.config.js**:

   ```javascript
   const webpack = require('webpack')
   // ...
   devServer: {
      contentBase: distDir, // 打包后文件位置
      compress: true, // 是否开启gzip压缩
      port: 9999, // 端口
      hot: true, // 启用热替换
      hotOnly: true, // 只有编译成功刷新
      // open: true, // 编译打开后浏览器
   },
   plugins: [
      new webpack.HotModuleReplacementPlugin()     
   ]
   ```

   （2）修改**.babelrc**:

   ~~~json
   // babel转换配置
   "plugins": ["react-hot-loader/babel"]
   ~~~

   （3）最后需要在入口文件**app.js**开启模块热替换（不开启没有热替换）: 

   ```javascript
   // ...
   if (module.hot) {
       module.hot.accept() // 开启热替换
   }
   ```

   （4）更改**package.json**配置：

   ~~~json
   "scripts": {
     "start": "npm run dev",
     "dev": "rm -fr dist && webpack-dev-server --mode development --colors --progress",
     "build": "rm -fr dist && webpack --mode production --colors --progress"
   }
   ~~~

   

6. 安装*HtmlWebPackPlugin*，用来生成html。`npm i -D html-webpack-plugin`，安装完成后需要在*webpack.config.js*中添加以下配置：

   （1）项目根目录新建一个**index.html**，可以在这个文件中配置其他额外的js等，当然也可以直接在HtmlWebPackPlugin里边配置。

   （2）修改**webpack.config.js**配置：

   ~~~javascript
   // ...省略部分
   plugins: [
   	new HtmlWebPackPlugin({
       	template: "./src/index.html", // 需要使用的模板
       	filename: "./index.html" // 输出文件名
     	})
   ]
   ~~~

7. 引入*eslint*配置，添加代码约束。首先全局安装*eslint-cli*，`npm i -g eslint-cli`。然后本地安装*eslint*，`npm i -D eslint`。然后项目根目录执行：`esint --init`来根据提示创建eslint配置文件。

   > 如果项目中使用了webpack配置的**alias**，eslint默认不会解析这个选项的。对应的处理方式是引入：`eslint-import-resolver-webpack`，然后在`eslintrc.js`中添加如下配置：
   >
   > ```js
   > module.exports = {
   > 	settings: {
   >     'import/resolver': {
   >       webpack: {
   >         //此处config对应webpack.config.js的路径
   >         config: path.resolve(__dirname, 'config/webpack.config.js')
   >       }
   >     }
   >   }
   > }
   > ```
   >
   > 然后就可以解析对应的alias了

8. 配置*scss*。 *style-loader*会将css整合到js中，基于打包后文件的考虑，我选择将css文件抽离出来，从而没有使用*style-loader*，使用了*mini-css-extract-plugin*。*css-loader*，*sass-loader*，*node-sass*是必须得，我的项目中还用到了*postcss*，并且使用了*postcss*的一些插件，接下来一步一步的完善。

   （1）基础配置：`npm i -D style-loader css-loader sass-loader node-sass`:

   ```javascript
   // ...配置rules
   rules: [
       {
           test: /\.(scss|css)$/,
           exclude: /node_modules/,
           use: [
              "style-loader",
              "css-loader",
              "sass-loader"
           ]
       }
   ]
   ```

   （2）使用*mini-css-extract-plugin*分离css，同时，配置压缩css需要使用的模块。`npm i -D mini-css-extract-plugin uglifyjs-webpack-plugin optimize-css-assets-webpack-plugin `：

   > 注意，CSS提取出来之后不支持本地开发热加载。所以本项配置建议只在生产打包时使用

   ```javascript
   // 提取出css，不注入js
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')
   // 配置压缩css
   const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
   const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
   
   // ...配置rules
   rules: [
       {
           test: /\.(scss|css)$/,
           exclude: /node_modules/,
           use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader"
           ]
       }
   ]
   
   // ...plugins
   plugins: [
       // ...省略其他的
       new MiniCssExtractPlugin({
         filename: '[name].[hash].css', // filename: devMode ? '[name].css' : '[name].[hash].css',
         chunkFilename: '[id].[hash].css' // chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
       })
   ]
   
   // ...optimization
   optimization: {
       runtimeChunk: 'single',
       // JS压缩设置. 生产环境压缩设置
       minimizer: [
         new UglifyJsPlugin({
           cache: true, // 缓存
           parallel: true, // 并行加载
           sourceMap: true // 生成sourceMap
         }),
          // CSS压缩设置. 生产环境压缩设置
         new OptimizeCSSAssetsPlugin()
       ]
   }
   ```

   （3）配置_postcss_，`npm i -D postcss-loader autoprefixer`：

   编辑**postcss.config.js**

   ~~~javascript
   module.export = {
       plugins: [
           require('autoprefixer')({ // 配置autoprefixer
               // 配置支持的浏览器
               browsers: [
                 '>1%',
                 'last 2 versions',
                 'not ie < 9', // React doesn't support IE8 anyway
               ]
           }),
       ]
   }
   ~~~

   >  **更新**：新版本的**autoprefixer**需要将**browsers**放在`.browserslistrc`，且`browserslistrc`方法支持更友好，还能避免一些bug。新建一个`.browserslistrc`文件，写入一下内容即可：
   >
   > ```shell
   > # browserslistrc
   > >1%
   > last 2 versions
   > not ie < 9 # React doesn't support IE8 anyway
   > ```
   >
   > 同时，**postcss.config.js**需要更改为：
   >
   > ```js
   > module.exports = {
   >   plugins: {
   >     autoprefixer: {},
   >   }
   > }
   > ```

   添加`post-css`还需加入`postcss-loader`，修改**webpack.config.js**:

   ~~~javascript
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')
   // ...配置rules
   rules: [
       {
           test: /\.(scss|css)$/,
           exclude: /node_modules/,
           use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "postcss-loader", // postcss-loader
              "sass-loader"
           ]
       }
   ]
   ~~~

   

   （4）配置*sass-resources-loader*自动添加全局变量，适用于有主题的需求。`npm i -D sass-resources-loader`

   需要新建一个*theme.scss*文件：`touch theme.scss`。

   配置*loader*：

   ~~~JavaScript
   // ...配置rules
   rules: [
       {
           test: /\.(scss|css)$/,
           exclude: /node_modules/,
           use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "postcss-loader",
              "sass-loader",
               {
                 // 使用sass-resources-loader自动添加全局变量等。
                 loader: 'sass-resources-loader',
                 options: {
                   resources: path.resolve(__dirname, 'theme.scss')
                 }
               }
           ]
       }
   ]
   ~~~

9. 配置图片、字体加载。`npm i -D url-loader file-loader`:

   ~~~javascript
   // ...配置rules
   rules: [
       // 图片加载
       {
         test: /\.(png|jpg|svg|jpeg|gif)$/,
         exclude: /node_modelues/,
         use: [
           {
             loader: 'url-loader',
             options: {
               limit: 10000, // 小于 10k 转换成base64编码
               // 打包时候开启public path
               // outputPath: '/dist/images/',
               // publicPath: '/images/'
             }
            }
         ]
       },
       // 字体加载
       {
         test: /\.(woff|woff2|eot|ttf|otf)$/,
         exclude: /node_modelues/,
         use: ['file-loader']
       }
   ]
   ~~~

10. 配置优化。打包后文件分割（具体可参考[这篇文章](https://segmentfault.com/a/1190000017893334)）：

    ~~~JavaScript
    const webpack = require('webpack')
    // ...plugin
    plugins: [
        new webpack.HashedModuleIdsPlugin(), // 根据模块的相对路径生成 HASH 作为模块 ID
    ]
    
    // ...optimization
    optimization: {
        runtimeChunk: 'single',
        // 打包文件切分设置
        splitChunks: {
          chunks: 'all', // 默认async 可选值 all 和 initial
          maxInitialRequests: Infinity, // 一个入口文件最大的并行请求数
          minSize: 0, // 避免体积过小而被忽略
          minChunks: 1, // 默认也是1表示最小引用次数\
          cacheGroups: {
            verdor: {
              test: /[\\/]node_modelues[\\/]/, // 如果需要的依赖特别小，可以直接设置成需要打包的依赖名称
              // eslint-disable-next-line
              name(modele, chunks, chcheGroupKey) { // // 可提供布尔值、字符串和函数，如果是函数，可编写自定义返回值
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1] // 获取模块名称
                return `npm.${packageName.replace('@', '')}` // 可选，一般情况下不需要将模块名称 @ 符号去除
              }
            }
          }
        }
      }
    ~~~

好了，到这里webpack的配置已经完成啦。接下来安装上React等就可以开发了。`npm i -S react react-dom react-router redux react-redux redux-saga`。 安装完成后开发环境直接`npm start`就可以运行项目啦。

以上内容全是自学肘见，如有不对之处，还请批评指出。