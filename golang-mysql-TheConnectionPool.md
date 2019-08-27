# 连接池

`database/sql`有一个基础的连接池。他并没有提供很多能力去控制或者检查这样这些连接池，但这有些有用的东西或许你应该知道的：

* 连接池意味着在单个数据库上执行两个连续的语句时可能会打开两个数据库连接并分别执行这两个语句。对于程序员来说，他们的代码没有按照想要的方式运行的这样的疑惑很常见的。举个例子🌰：后面跟着一个`INSERT`语句的`LOCK TABLES`可以被阻塞，因为`INSERT`位于不保存表锁的连接上。
* 当连接池里没有空闲的链接的时候才会建立一个新的链接。
* 默认情况下，链接的数量是没有限制的。如果你想一次性做很多事，你可以建立随意多数量的链接。但是这样的话，可能会引起数据库返回一个*too many connections*的错误。
* 在Go 1.1或更高的版本上，可以使用`db.SetMaxIdleConns(N)`来限制连接池中最大的空闲连接数，但是这并不会限制连接池的数量。
* 在Go 1.2或更高的版本上，可以使用`db.SetMaxOpenConns(N)`来限制连接到数据库链接的总数量。不幸的是，一个[死锁](https://groups.google.com/forum/#!msg/golang-dev/jOTqHxI09ns/x79ajll-ab4J)([已经修复](https://code.google.com/p/go/source/detail?r=8a7ac002f840))会限制`db.SetMacOpenConns(N)`在1.2版本中的安全使用。
* 链接回收的速度是相当快的。使用`db.SetMaxIdleConns(N)`设置大量的空闲链接可以减少链接回收时的消耗，并且有助于保持链接以便于重新使用。
* 保持一个空闲的数据库链接可能会引起一些问题(比如说Miscosoft Azure的MySQL上有一个[issue](https://github.com/go-sql-driver/mysql/issues/257) )。如果你的链接因为空闲的时间太长引起超时错误的时候，可以尝试使用`db.SetMaxIdleConns(0)`来解决这样的问题。
* 因为重用长链接可能会导致网络问题，那就可以使用`db.SetConnMaxLifetime(duration)`指定一个链接可重用时间的最大值来解决这样的问题。这可以懒惰的关闭未使用的链接，就是说他会延迟关闭过期的链接。

