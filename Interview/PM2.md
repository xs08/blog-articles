# PM2

### PM2启动模式fork与cluster的区别

* **fork**模式是使用最基本的进程运行方式，只是单实例运行server，无法实现TCP链接共享。好处是可以修改*exec_interpreter*，使用pm2运行js之外的语言，常用户多语言混编，比如php, python等，如下:

  ```bash
  pm2 --interpreter [bash|python|...]
  ```

  缺点：不支持端口复用，需要自己做应用的端口分配和负载均衡的子进程业务代码。缺点是单服务实例容易由于异常崩溃。

* **cluster**模式，多实例多进程，只支持node，可以启动多个server实例，并在各个实例之前实现负载均衡而且共享TCP连接，也就是端口可以复用。不需要额外的端口配置，0代码实现负载均衡。使用*Node.js cluster模块实现*。

  **优点：**由于多实例机制，可以保证服务器的容错性，就算出现异常也不会出现多个服务器实例同事崩溃。

​	共同点，由于都是多进程，都需要消息机制或数据持久化实现数据共享。



### Node.js cluster模块介绍

**cluster**用户一些可以共享TCP连接的worker进程。首先创建一个master进程，随后根据设置的次数 fork出相应的workers。master和workers通过进程间通信(IPC机制)实现句柄等数据交换，cluster模块自带负载均衡，默认使用Round-Robin算法实现，master监听TCP端口，并根据RR算法将请求交给指定的worker进行处理

cluster使用示例：

```javascript
const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  const server = http.createServer((req, res) => {
    res.writeHead(200)
    res.end(`hello world from PID: ${process.pid}`)
  })
  server.listen(8000)

  console.log(`Worker ${process.pid} started`)
}
```
pm2内置了以cluster模式启用server的方式，不需要对代码进行改动，只需要生成自己的http server即可。类似于
```javascript
const http = require('http')
http.createServer((req, res) => {
  res.writeHead(200)
  res.end('hello world')
}).listen(8000)
```
随后，使用pm2启动：
```bash
pm2 start app.js [options...]
```


### PM2常用命令

* 调整集群数量：`pm2 scale <app name> <cluster number>`
* 显示所有进程日志: `pm2 logs`
* 停止所有进程: `pm2 stop all`
* 重启所有进程: `pm2 restart all`
* 秒停机重载进程 (用于 NETWORKED 进程): `pm2 reload all`
* 停止指定的进程: `pm2 stop <app>`
* 重启指定的进程: `pm2 restart`
* 产生 init 脚本 保持进程活着: `pm2 startup`
* 运行健壮的 computer API endpoint: `pm2 web`
* 杀死指定的进程: `pm2 delete <app>` 
* 杀死全部进程: `pm2 delete all`
**另外**: `pm2 reload `可以重启app对应的所有worker，重启对于每一个worker，会在一个新的worker生成之后再kill掉之前的worker，这样即便是在对服务器进行更新时，也可以正常处理用户的请求，做到无缝升级重启。同时可以参考pm2的`gracefulReload`命令，实现在实例退出之前关闭数据库连接等需要处理的操作：
js操作
```javascript
process.on('message', function(msg) {  
  if (msg === 'shutdown') {
    close_all_connections();
    delete_cache();
    server.close();
    process.exit(0);
  }
});
```


### 引用文档

* [pm2的cluster模式与fork模式的区别](https://github.com/mopduan/team/issues/19)
* [Linux基础--linux进程间通信(IPC)机制总结](https://blog.csdn.net/a987073381/article/details/52006729)



