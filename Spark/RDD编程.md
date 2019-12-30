## RDD编程

RDD--弹性分布式数据集(Resilient Distributed Dataset)是Spark对数据的核心抽象，实质就是分布式的元素集合。 在Spark中， 对数据的操做基本就是对RDD进行操做，包括创建新的RDD，转化已有的RDD以及调用RDD操做进行求值等。我们对于RDD的操做，Spark会将RDD的数据分发到集群上，并将操做并行化执行

### RDD基础

RDD创建出来后，支持两种类型的操做:转化操做(transformation和行动操做(action)。转化操做与行动操做的区别在于Spark计算RDD的方式不同。Spark对于RDD的计算是惰性的,只有第一次在行动操做中用到的时候才会进行真正的计算。**`注意: `默认情况下，RDD会在每次进行行动操做的时候重新计算。如果想在多个行动操做中重用同一份RDD，可以使用`RDD.persist()`让Spark缓存此RDD(默认情况下，Spark可能只需要对数据做一遍计算就可以，所以不缓存数据)**。这也是为什么将数据称为弹性数据集的原因

#### 创建RDD

Spark提供两种创建RDD的方法: 1.读取外部数据集 2.在驱动器程序中对一个集合进行并行化。

1. 读取外部数据集的方式有很多,基本读取一个文本文件的方式如下: 

   ```python
   scLines = sc.textFile("file.txt")
   ```

2.  将一个数据集合传递给`parallelize`方法并行化数据:

   ```python
   scLines = sc.parallelize(["pands", "i like pands"])
   ```

#### RDD操做

RDD支持两种操做: 转化操做(transformation和行动操做(action). 转化操做是





