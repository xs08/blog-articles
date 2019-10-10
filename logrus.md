## logrus 入门

Github: [github.com/sirupsen/logrus](https://github.com/sirupsen/logrus)

### logrus特性：

1. 完全兼容golang标准库logs模块，logrus拥有的六种日志级别：debug、info、warn、error、fatal和panic，这是golang标准库日志模块的API的超集。使用标准库的日志迁移时成本几乎为0。

2. 可扩展的Hook机制：允许使用者通过hook的方式将日志分发到任意地方，如本地文件系统、标准输出、logstash、elasticsearch或者mq等，或者通过hook定义日志内容和格式等。

3. 可选的日志输出格式：logrus内置了两种日志格式，JSONFormatter和TextFormatter，如果这两个格式不满足需求，可以自己动手实现接口Formatter，来定义自己的日志格式。

4. Field机制：logrus鼓励通过Field机制进行精细化的、结构化的日志记录，而不是通过冗长的消息来记录日志。

5. logrus是一个可插拔的、结构化的日志框架。可进行按需配置。

   

#### 切换日志输入格式

```golang
// 默认文字模式
log.SetFormatter(&log.TextFormatter{})

// JSON 格式
log.SetFormatter(&log.JSONFormatter{
	DisableColors: true, // 控制台输出的时候不显示颜色
	FullTimestamp: true, // 显示完整的时间格式
})
```

#### 设置打印调用函数

```golang
log.SetReportCaller(true) // 打印调用函数,默认不打印.(method字段为调用方法)
```

> **除非特殊需要, 一般不要设置打印调用函数**.打印调用函数会有20%~40%的性能损耗!!!