# Spark入门

记录`python`操做Spark的基本操做

### 初始化SparkContext

```Python
from pyspark import SparkConf, SparkContext

conf = SparkConf().setMaster("local").setAppName("My App")
sc = SparkContext(conf = conf)
```

