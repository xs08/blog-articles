## Golang学习中一些小知识点的整理

### 数组

1. `[3]int{}` 和`[4]int{}`是两种不同的数据类型，一个是长度为3的数组，一个是长度未4的数组。数组是不可变结构，所以数组之间可以使用`==`比较两个数组是否相同。
2. 定义数组：`[...]int{args...}`，这时数组的长度由初始化参数args来决定。

### Slice

1. slice与底层数组的关系：

   slice包含三个数据结构：指针、长度、容量。指针指向slice开始元素（底层数组中的某一个元素），`len(slice)`返回slice长度，`cap(slice)`返回slice容量

2. slice无法做比较：

   1. slice元素是非直接的，有可能包含它自身
   2. slice元素是非直接的，同一个slice在不同的时间会有不同的元素

3. Golang中的Map仅对键做浅拷贝，所以要求Map的键在Map的整个生命周期保持不变。所以slice不能作为Map的键

4. `bytes.Equal([]byte, []byte)`可用来比较两个byte slice是否相等

5. 唯一允许使用`==`与slice比较的是: `nil`，slice的零值为`nil`，值为`nil`的slice没有对应底层数组：

   ```go
   var s []int // len(s) == 0, s == nil
   s = nil 	// len(s) == 0, s == nil
   s = []int(nil) // len(s) == 0, s == nil
   s = []int{} // len(s) == 0, s != nil 注意！！！，此时分配了一个底层数组
   // 所以，检验slice是否为空使用len(slice) == 0, 而不是slice == nil
   ```

6. `make([]int, len, cap)`初始化一个slice，并传入len、cap：其实make创建了一个无名数组，只能使用创建的slice访问，返回的slice引用了整个数组

7. `slice = append(slice, ele...)`用来将元素追加到slice后面：`append`会检查slice是否有足够的容量追加元素，容量不够时会重新分配一个底层数组（增长策略较复杂，保证线性复杂度），不保证append后底层数组是否改变

8. `copy(dst, src slice)`，将src复制到dst，返回成功复制元素的数量（dst,src中的最小值）。不会存在`copy`引起索引越界

### Map

1. 初始化:`make(map[type]type) || map[type]type`
2. `delete(map, key)`移除map中一个元素，即使key不存在也是安全的操做
3. map元素是一个值，不是一个变量，所以map元素不能获取地址，`&map[sss]`编译错误
4. `for key, value := range imap {}`迭代顺序不固定。可将map中的键提出来放到数组中，遍历数组取值就可以顺序执行了。可以使用`sort.Strings(slice)`来对string slice排序
5. `map`类型的零值是nil
6. `value, ok = map[key]`ok用来检查是否存在对应key的value

### Struct

1. 如果一个结构体的成员变量名称是大写的，那么这个变量是可导出的
2. 如果所有结构体成员都是可比较的，那么这个结构体是可比较的



#### Make 和 New

Make只用来创建slice,map,channel。 其中map使用前必须初始化， append可直接动态扩容slice，而map不行。

