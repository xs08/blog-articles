# Go Redis

github上redis的golang client 对比(截止文章更新时间)：

| name            | link                               | Stars | Issues |
| --------------- | ---------------------------------- | ----- | ------ |
| go-redis/redis  | https://github.com/go-redis/redis  | 6987  | 33     |
| gomodule/redigo | https://github.com/gomodule/redigo | 6534  | 14     |

差别不大，个人选用`gomodule/redigo`。原因可能是因为issues少😁

#### 支持的功能有

* [Print-Like API](http://godoc.org/github.com/gomodule/redigo/redis#hdr-Executing_Commands)，支持所有Redis命令
* [Pipelining](http://godoc.org/github.com/gomodule/redigo/redis#hdr-Pipelining)，包括pipelined相关事务
* [Publish/Subscribe](http://godoc.org/github.com/gomodule/redigo/redis#hdr-Publish_and_Subscribe)支持
* [连接池](http://godoc.org/github.com/gomodule/redigo/redis#Pool)支持
* [Script helper type](http://godoc.org/github.com/gomodule/redigo/redis#Script), 使用EVALSHA优化脚本辅助类型
* [Helper functions](http://godoc.org/github.com/gomodule/redigo/redis#hdr-Reply_Helpers)，支持的命令集工作

#### 安装

`go get github.com/gomodule/redigo/redis`

#### redigo 的并发

同一个redis链接支持的并发有限，仅支持一个调用者发送Receive请求，另一个调用者执行Send或者Flush这样的情况（最好不要这样做）。

使用并发最好的方式是通过连接池的方式，从连接池里获取到一个链接，并在这个链接上进行事务的操作，完事将其放回连接池。

####  定义连接池

Redigo的Pool结构体定义如下：

```go
type Pool struct {
  MaxIdle int
  MaxActive int
  Wait bool
  IdleTimeout time.Duration
  TestOnBorrow func(c Conn, t time.Time) error
  Dial func() (Conn, error)
  DialContext func(ctx context.Context) (Conn, error)
  MaxConnLifetime time.Duration
}
// 字段解读
// MaxIdle 连接池中最大的空闲连接数
// MaxActive 指定时间内允许分配的最大连接数，0的时候不限制
// Wait 如果Wait为true，则Pool.Get方法在没有可用链接限制的时候会阻塞等待
// IdleTimeout 返回连接池的空闲链接返回后多少时间之后关闭，0不关闭。应该设置这个值而不是等待服务器超时关闭
// TestOnBorrow 当从连接池取的链接的时候，运行测试的函数。测试连接是否OK
// Dail 建立链接的函数
// MaxConnLifetime 建立链接多久之后将其关闭，0的时候不关闭
// DialContext ...

// 使用示例
RedisConn := &redis.Pool{
  MaxIdle: 30,
  MaxActive: 30,
  IdleTimeout: 200,
  Dial: func() (redis.Conn, error) {
    c, err := redis.Dial("tcp", "host")
    if err != nil {
      return nil, err
    }
    if needAuth {
      if _, err = c.Do("AUTH", "auth string"); err != nil {
        c.Close()
        return nil, error
      }
    }
    return c, nil
  },
  TestOnBorrow: func(conn redis.Conn, t time.Duration) error {
    _, err := conn.Do("PING")
    return err
  }
}
```



#### 使用

redigo获取到connections后就可以进行操作了，支持以下命令操作：

```golang
// 一、普通执行命令
Do(commandName string, args ...interface{}) (replay interface{}, err error)
// 示例
n, err := conn.Do("APPEND", "key", "value")


// 二、使用Pipelining, Send写入命令到缓冲池，Flush将缓冲池数据发送到redis
服务端，Receive从服务端获取单个回复消息
Send(commandName string, args ...interface{}) error
Flush() error
Receive() (reply interface{}, err error)
// 1. 普通示例
conn.Send("SET", "foo", "bar")
conn.Send("GET", "foo")
conn.Flush()
conn.Receive() // 执行 GET foo 的返回消息
v, err := conn.Receive() // 执行 SET foo bar 的返回消息
// 2. Do方法示例。Do方法包含了Pipelining的方法，执行Do方法的时候会执行Send/Flush/Receive方法，如果Do方法执行过程中有任何error，就会返回该error，否则返回接收到的最后一个回复
conn.Send("MULTI")
conn.Send("INCR", "foo")
conn.Send("INCR", "bar")
r, err := conn.Do("EXEC")
fmt.Println(r) // [1, 1]


// 三、发布订阅，两种实现方式
// 1. 使用Send、Flush、Receive模型
conn.Send("SUBSCRIBE", "example")
conn.Flush()
for {
	reply, err := conn.Receive()
	if err != nil {
	  // handle error
	}
	// process pushed message reply
}
// 2. 使用PubSubConn类型，PubSubConn类型内嵌了一个Conn链接，并且实现了Subscribe, PSubscribe, Unsubscribe, PUnsubscribe等发布订阅相关的方法。下面示例使用类型断言来区分返回数据类型
psc := redis.PubSubConn{Conn: c}
psc.Subscribe("example")
for {
	switch v := psc.Receive().(type) {
	case redis.Message:
		// handle massage
		fmt.Printf("%s: message: %s\n", v.Channel, v.Data)
	case redis.Subscription:
		// handle subscription message
		fmt.Printf("%s: %s %d\n", v.Channel, v.Kind, v.Count)
	case error:
		return v // some error
	}
}
```

#### reply辅助函数

Redigo提供了将`conn.Receive()`获取的响应转换为Bool, Int, Bytes, String, Strings的功能函数。并且允许将这些功能函数与**Do**和**Receive**方法嵌套起来使用，当`Do`等方法返回错误的时候，辅助函数直接将其错误返回。使用方式如下：

```golang
exists, err := redis.Bool(conn.Do("EXISTS", "foo"))
if err != nil { /* handle error */ }
```

> 类似的函数有：`Bool`, `ByteSlices`, `Bytes`, `Float64`, `Float64s => Float64Slice)`, `Int`, `Ints => IntSlice`, `Int64Map => map[string]int64`, `String`, `Strings => StringSlice`, `StringMap => map[string]string`, `Uint64`, `Values => []interface{}`等。更多函数看[文档](https://godoc.org/github.com/gomodule/redigo/redis#pkg-index)



#### Scan方法

Redigo还提供了一个Scan方法，将执行获取的结果存入一个变量：

> func Scan(src []interface{}, dest ...interface{}) ([]interface{}, error)

```golang
// Scan将结果存入变量
var value1 int
var value2 string
reply, err := redis.Values(c.Do("MGET", "foo", "bar"))
if err != nil {
	// handle error
}
if _, err := redis.Scan(reply, &value1, &value2); err != nil {
	// handle error
}
```

Scan方法多用在需要将执行结果存入外部传入变量的地方。

> Scan方法还有：
>
> `ScanSlice()`: `func ScanSlice(src []interface{}, dest interface{}, fieldNames ...string) error`
>
>  `ScanStruct`: `func ScanStruct(src []interface{}, dest interface{}) error`