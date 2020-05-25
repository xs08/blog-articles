# JS相关规范

## CommonJS
主要是Node.js使用，提供了四个重要的环境变量: `module`, `exports`, `require`, `global`。实际使用时，用`module.exports`定义当前模块对外输出的接口，用`require`加载模块。
**CommonJS**用同步的方式加载模块。在服务端由于模块文件都存在本地读取很快没问题，但是浏览器端由于网络原因，更高的方式是使用异步按需加载

## AMD规范和require.js
AMD规范使用异步加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。`require.js`是AMD规范的践行者：用`require.config()`指定引用路径，用`define()`定义模块，用`require()`加载模块

```javascript
// 首先引入require.js
// <script src="require.js"></script>

// 入口文件进行配置
// 使用config指定各模块的路径和引用名
require.config({
  baseUrl: 'src/js', // 目录
  path: {
    jquery: 'jquery.min', // 实际路径为 src/js/jquery.min.js
    otherModule: 'modulepath',
  }
})

// 定义一个模块。 如果此模块还有依赖其他模块，则将依赖声明在数组中
define(['dep1', 'dep2'], function(dep1, dep2) {
  // 可以使用 dep1 dep2 返回的方法
})

// 引入模块，执行基本操作
require(['jquery', 'otherModule'], function(jquery, otherModule) {
  // 此处可以使用jquery和otherModule
})

```


## CMD规范和sea.js
CMD与AMD的不同点在于：**AMD**主要思想是依赖前置、提前执行，不管实际引入的模块是否执行，只要声明了则会提前引入并执行。**CMD**主要思想是依赖就近、延迟执行(主要是sea.js推广过程中产生的)
```javascript
// 先引入sea.js
// <script src="sea.js"></script>

// CMD使用方式写法
define(function(require, exports, module) {
  const a = require('a')
  a.doSomething()
  if(false) {
    var b = require('b')
    b.doSomething()
  }
})

// sea.js
// CMD定义模块 math.js
define(function(require, exports, module) {
  exports.add = functon (a, b) {
    return a + b
  }
})
// 加载模块
seajs.use(['math.js'], function(math) {
  var sum = math.add(1 ,2)
})
```

## ES Module
ES是语言标准层面上实现的模块功能，实现简单。主要由两个命令构成：`exports`和`import`。**ES Module**不是对象，`import`命令会被JS引擎静态分析，在编辑时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载(按需加载)

## 区别
1. CommonJS模块输出的是值拷贝，ES6输入的是值引入
  * CommonJS输出值拷贝，一旦输出一个值，模块内部的变化影响不到这个值（无法实现基于文件的单例模式）
  * ES生成的是只读引用，等到脚本真正执行的时候才会到被加载的模块去取值。ES6模块是动态引用，不会缓存值

2. CommonJS模块是运行时加载，ES6是编译时输出接口
  * CommonJS模块就是在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”
  * ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”
