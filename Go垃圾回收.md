## Golang垃圾回收算法

golang中垃圾回收算法主要是_三色标记清除法_[看看论文](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD05xx/EWD520.html)。这个算法使用**写屏障(write barrier)**与程序一起并发工作。也就是说go程序运行起来的时候，go调度器负责应用程序的调度，而垃圾回收器会像常规应用程序一样，使用多个**goroutine**并发进行垃圾回收相关的工作。

三色标记清楚法的基本思想是将内存堆中的数据根据其本身的状态使用算法分配一种颜色，并将其规划到对应颜色的集合里面，然后对不同颜色的集合进行整理。



[Legendtkl-Golang垃圾回收剖析](http://legendtkl.com/2017/04/28/golang-gc/): 重点介绍垃圾回收算法

[SegmentFault垃圾回收](https://segmentfault.com/a/1190000016828394): 重点说了垃圾回收的问题，以及一些提高如何提高GC性能的方法

