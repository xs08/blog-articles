### 一、自定义HTTP配置

Gin可直接使用`gin.Default`创建**Router**，也可将router传入http.Server创建server。如下：

直接使用：

```golang
func main() {
	router := gin.Default()
	http.ListenAndServe(":8080", router)
}
```

也可：

```golang
func main() {
	router := gin.Default()
	// 基础示例。可添加所有http.Server的参数
	s := &http.Server{
		Addr: ":8080",
		Handler: router,
		ReadTimeout: 10 * time.Second,
		WriteTimeout: 10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	s.ListenAndServe()
}
```



### 二、自定义中间件

使用Gin的时候可以编写自己的中间件，格式如下：

```golang
func Logger() *gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()
		
		// 设置 example 变量到请求上下文
		c.Set("example", "12344")
		
		// 请求前. 类似koa洋葱路由
		c.Next()
		
		// 请求后
		latency := time.Since(t)
		log.Print(latency)
		
		// 获取请求中发送的 status
		status := c.Writer.Status()
		log.Println(status)
	}
}

// 使用此中间件
func main() {
	r := gin.New()
	r.Use(Logger())
	
	r.GET("/test", func(c *gin.Context) {
		example := c.MustGet("example").(string)
		
		// 打印 12345
		log.Pringln(example)
	})
	
	// 监听并在 0.0.0.0:8080 上启动服务 
	r.Run(":8080")
}
```

简单来说中间件的使用就是传入`*gin.Context`，然后对其进行操作。中间件中可用`c.Set(key, value)`为请求添加参数并在路由处理中用`c.MustGet(key)`来获取添加的参数；调用`c.Next()`进入路由处理，`c.Next()`之后是路由处理之后的内容。

### 三、运行多个服务

Gin可运行多个服务，基本原理是使用golang.org实现的`errgroup`来实现，代码如下：

```golang
package main
import (
	"github.com/gin-gonic/gin"
	"golang.org/x/sync/errgroup"
)

var g errgroup.Group

func main() {
	g.Go(func() error {
		g1 := gin.Default()
		g1.Use(gin.Recovery())
		return g1.Run(":8080")
	})
	
	g.Go(func() error {
		g2 := gin.Default()
		g2.Use(gin.Recovery())
		return g2.Run()
	})
	
	if err := g.Wait(); err != nil {
		log.Fatal(err)
	}
}
```

### 四、在中间件中使用Goroutine

**注意**：在中间件或handler中启动新的goroutine时，不能使用原始的上下文，必须使用只读副本。使用`cCp := c.Copy()`：

```golang
func main() {
	r := gin.Default()
	r.GET("/")
}
```







