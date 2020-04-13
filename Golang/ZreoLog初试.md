# ZeroLog初试

据说ZeroLog的性能相较于其他日志库都是较好的, 今天就试一下怎样使用他吧

### 支持功能如下

* 非常快
* 非常低的内存占用
* 日志等级区分
* 简单易用
* 支持钩子
* 支持上下文字段
* 集成`content.Context`
* 内置`net/http`辅助函数
* 支持JSON或者CBOR编码格式
* 为开发提供优美的日志格式

### 安装

```bash
go get -u github.com/rs/zerolog/log
```



### 使用方式

##### 1. 设置时间格式

```
// 默认使用unix时间格式
zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
```

##### 2. 基本使用

```golang
log.Debug().
	Str("Scale", "833").
	Float64("Interval", 833.023).
	Msg("Hello")
	
```

##### 3. ZeroLog的日志等级

* panic(zerolog.PanicLevel, 5)
* fatal(zerolog.FatalLevel, 4)
* error(zerolog.ErrorLevel, 3)
* warn(zerolog.WarnLeven, 2)
* info(zerolog.InfoLevel, 1)
* debug(zerolog.DebugLevel, 0)
* trace(zerolog.TraceLevel, -1)

更改日志级别可以在任何地方使用`zerolog.SetGlobalLevel()`进行更改