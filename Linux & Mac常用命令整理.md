### Linux & Mac 常用命令整理



#### 网络相关

* curl: 作用是发出网络请求，然后得到和提取数据，显示在"标准输出"（stdout）上面

  * -o 保存下来：curl -o [文件名] www.test.com

  * -L 自动跳转：curl -L www.test.com

  * -i 显示头信息：curl -i www.test.com

  * -I 直显示Response信息: curl -I www.test.com

  * -v 显示一次http通信的整个过程：curl -v www.test.com

  * -X 指定请求方法，默认: -X GET： curl -X GET www.test.com

  * -H/--header 指定请求头：curl -H "Content-Type=Application/json"

  * —data 指定发送数据: curl -X POST —data "data=xxx" www.test.com/api

  * —data-urlencode 发送数据编码：curl -X POST —data-urlencode "data=xxx" www.test.com

  * —refer 添加refer字段：curl —refer http://www.test.com http://www.test.com

  * —user-agent 修改UserAgent字段：curl —user-agent "IOS" www.test.com

  * —cookie 发送cookie：curl —cookie "cokie1=xxx" www.test.com

    * `-c cookie-file`可以保存服务器返回的cookie到文件，`-b cookie-file`可以使用这个文件作为cookie信息，进行后续的请求。
  
      ~~~bash
      curl -c cookies http://www.test.com
    curl -b cookies http://www.test.com
      ~~~

      

  * —header 增加头信息：curl —header "Content-Type:applition/json" http://www.test.com
  
  * —form upload=@localfilename —form press = OK 上传文件: curl —form upload=@localfilename —form press=OK www.test.com/form
  
  * --head 检查响应头信息






#### 使用wrk进行http性能测试

为什么要用wrk：比较常见的web压测工具是ab，但是ab工作在单线程上只能利用单一CPU，给性能好的服务端做压测的时候力有不足。经常有测试机负荷满了但是服务器性能还绰绰有余的情况。这种情况在测试默认启用多核的go程序的时候是比较常见的。wrk默认可以使用单一CPU的多核进行测试，还可以添加[lua脚本](https://github.com/wg/wrk/tree/master/scripts)以应对不同场景的需求。详情见[wrk主页](https://github.com/wg/wrk)，这里简单介绍使用方式如下：

```bash
wrk -t12 -c400 -d30s http://yourtest.com/
```

输出如下：

```bash
Running 30s test @ http://127.0.0.1:8080/index.html
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   635.91us    0.89ms  12.92ms   93.69%
    Req/Sec    56.20k     8.07k   62.00k    86.54%
  22464657 requests in 30.00s, 17.76GB read
Requests/sec: 748868.53
Transfer/sec:    606.33MB
```

参数如下：

```bash
-c, --connections: total number of HTTP connections to keep open with
                   each thread handling N = connections/threads

-d, --duration:    duration of the test, e.g. 2s, 2m, 2h

-t, --threads:     total number of threads to use

-s, --script:      LuaJIT script, see SCRIPTING

-H, --header:      HTTP header to add to request, e.g. "User-Agent: wrk"

    --latency:     print detailed latency statistics

    --timeout:     record a timeout if a response is not received within
                   this amount of time.
```





