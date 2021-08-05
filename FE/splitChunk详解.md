# webpack4优化之splitChunk详解

## 一、参数解读

* chunks (默认是async) ：initial、async和all
* minSize(默认是30000)：形成一个新代码块最小的体积
* maxSize(默认是50000)：形成一个代码块最大的体积，一般不用配置
* minChunks（默认是1）：在分割之前，这个代码块最小应该被引用的次数（译注：保证代码块复用性，默认配置的策略是不需要多次引用也可以被分割）
* maxInitialRequests（默认是3）：一个入口最大的并行请求数
* maxAsyncRequests（默认是5）：按需加载时候最大的并行请求数
* 
* test： 用于控制哪些模块被这个缓存组匹配到。原封不动传递出去的话，它默认会选择所有的模块。可以传递的值类型：RegExp、String和Function
* name(打包的chunks的名字)：字符串或者函数(函数可以根据条件自定义名字)
* priority ：缓存组打包的先后优先级。