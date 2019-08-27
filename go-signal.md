## signal

golang中对信号的处理主要使用os.signal包中的两个方法：

* `signal.Notify(c chan <- os.Signal, sig ...os.Signal)`:  用来监听收到的信号。第一个参数是接收信号的channel；第二个表示需要监听的信号，**不设置表示监听所有信号**。当接收到监听的系统信号时候，会将信息发送到c上
* `signal.Stop(c chan <- os.Signal)`: 用来取消监听信号。参数是需要取消监听的channel，取消监听之后收到系统信号不会在发送到c上

接收信号如下：

```go
func main() {
  c := make(chan os.Signal)
  signal.Notify(c) // 设置监听，此时收到所有信号都会发送给c
}
```

