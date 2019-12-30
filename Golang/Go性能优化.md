# Go性能优化

其他的语言中，需要做性能优化的话可能还需要引入其他的库或者工具才能进行具体的性能优化．但是在Go语言中，官方为我们提供了进行性能分析的工具：`pprof`．这个库不仅能在`http`请求中使用，也可以在非http的应用中使用．只需要在代码里面引入一下`pprof`的包，然后开启http Server 就好了

## 数据采样

### 1. 非网络型的应用

对于非网络型的应用，只需要引入`pprof`包，然后执行相关的分析代码就可以了：

```golang
import "runtime/pprof"

// 开启 CPU　性能分析, 将CPU使用情况的采样数据写入 w, 一般情况下写入一个文件就OK
pprof.StartCPUProfile(w io.Writer)

// 停止 CPU 性能分析. 
pprof.StopCPUProfile()
```

应用执行完毕以后，可以从之前传入的`io.Writer`中获得CPU的采样数据．然后就可以使用`go tool pprof`进行相关的性能分析了

### 2.服务型应用

对于web服务等服务型的应用，我们就可以使用`net/http/pprof`库，它能够



