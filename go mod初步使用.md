## Go Mod使用记录

go mod是golang官方推出的依赖管理工具, 旨在处理golang项目开发中依赖管理的难题. 它仅在Go 1.11与1.12初步实现(所以需要1.11版本以上, 才能使用), 且不使用$GOPATH作为项目管理依赖, 接下来我们边用边讲吧. [Go Modules官方介绍](https://github.com/golang/go/wiki/Modules)

新的包管理模式解决了一下问题:

1. 项目中`go run`运行项目的时候, go mod会自动下载依赖包
2. 由于不使用`$GOPATH`管理项目, 所以项目也不必放在`$GOPATH/src内`了
3. 项目内会生成一个`go.mod`文件, 文件内列出包的依赖
4. 依赖的第三方包可以指定版本号, go mod下载包的时候会下载指定Release版本号的包, 默认latest
5. 对于已经转移的包, 可以用replace替换, 不需要更改代码(对于不能下载的包, 可以使用本地的文件替换, 下文介绍)



#### 准备开始

1. 首先需要确保Go版本是1.11以上, 现在稳定版本都已经发布1.12了, 建议升级到1.12

2.  go mod现在需要设置环境变量**GO111MODULE**, 他有三个值:

   * `GO111MODULE=off`: go命令行将不会支持module功能，寻找依赖包的方式将会沿用旧版本那种通过vendor目录或者GOPATH模式来查找
   * `GO111MODULE=on`: go命令行会使用modules，而一点也不会去GOPATH目录下查找
   * `GO111MODULE=auto`:  默认值，go命令行将会根据当前目录来决定是否启用module功能。这种情况下可以分为两种情形：
     * 当前目录在GOPATH/src之外且该目录包含go.mod文件
     * 当前文件在包含go.mod文件的目录下面

   既然是需要使用do mod, 那设置为**on**或者**auto**就好了, 或者也可以根据自己的需要进行使用

   > 当modules 功能启用时，依赖包的存放位置变更为`$GOPATH/pkg/mod/${package}/${package@version}`，`package`是指包名, `@version`是对应包的版本, 所以使用mod是允许package多个版本并存，且多个项目可以共享缓存的 module

---

正式开始前, 我们先大概了解一下go mod有那些命令:

|commands   | descrition                  |
|-----------|-----------------------------|
|download   | download modules to local cache(下载依赖包)                |
|edit       | edit go.mod from tolls or scripts(编辑go.mod, 不要手动编辑) |
|graph      | print module requirement graph(打印模块依赖图)              |
|init       | initalize new module in current directory(当前目录初始化mod)|
|tidy       | add missing and remove unused modules(拉取缺失模块,移除多余模块)  |
|vendor     | make verdored copy of dependencies(将依赖复制到vendor下)    |
|verify     | verify dependencies have expected content(验证依赖是否正确)  |
|why        | explain why packages or modules are needed(解释为什么需要依赖)  |



### 新建项目

切换到项目目录下, 新建一个hello项目, 使用`init`命令: 

```bash
go mod init hello
```

执行之后会在当前目录多一个`go.mod`文件. 当运行项目的时候, `go mod`会自动从远程仓库下载依赖包, 然后将依赖包整理到`go.mod`中, 并且会生成一个`go.sum`的文件, 这个文件记载的是go依赖包生成的hash值, `go mod`会使用此文件校验依赖包是否正确(所以我们不应该手动更改`go.mod`文件, 需要的时候使用其提供的命令进行操做)



### 添加依赖（更换依赖版本）

以uuid为例：

```bash
 # 基础用户
 go mod edit -require=github.com/satori/go.uuid
 
 # 添加版本号
 go mod edit -require=github.com/satori/go.uuid@master
 
 # 更换依赖的版本，通添加版本号一样，只需更改为想要的版本就行,改为1.1.12
  go mod edit -require=github.com/satori/go.uuid@1.1.12
```




### 替换本地包
有时候由于网络原因没法下载指定依赖包, 此时可以将需要包下载到本地,  然后替换需要的包引用就可以了. 
如 
> 当运行项目的时候提示golang.org/x/tools, 此时可以使用如下命令替换包导入路径:
> ```bash
> go mod edit -replace golang.org/x/tools=/${some-local-path}/x/tools
> ```
> 然后会在go.mod中多一条replace的记录, 此时项目就可以运行啦



参考文章:

* [拜拜了，GOPATH君！](https://zhuanlan.zhihu.com/p/60703832)
* [go mod 使用](https://juejin.im/post/5c8e503a6fb9a070d878184a)
* [Go Blog](https://blog.golang.org/using-go-modules)