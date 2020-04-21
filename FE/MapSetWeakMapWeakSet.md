# Map/Set/WeakMap/WeakSet

## 一、Map

`map`对象保存键值对，并且能够几号键的原始插入顺序。任何值（对象或者原始值）都可以作为一个键或者一个值

### 1.Map键比较方式

map键比较基于`sameValueZreo`算法（同`Object.is`），算法内容如下：

* `NaN`与`NaN`相等(Chrome80 `NaN` 不等于`NaN`), 剩下其他值都是使用`===`比较
* 目前的ECMAScript规范中，`-0`与`+0`被认为是相等的（以前不是）。map也认为`+0`与`-0`相等

> 第一点意味着Map可使用`NaN`作为键值。
>
> 第二点也就是说Map键的比较与`Object.is`不同之处在于`Object.is`认为`+0`与`-0`不等，而Map中则与最新的ECMAScript规范保持一致，认为两者是相等的

### 2. Objects与Map比较

|          | Map                                | Object                                                       |
| -------- | ---------------------------------- | ------------------------------------------------------------ |
| 意外的键 | 默认不包含任何键。只有现实插入的建 | 原型链上的键名可能与自己设置的建冲突。(ES5中可使用`Object.create(null)`创建原型链为空的对象) |
| 键的类型 | 任意值（函数、对象、基本类型）     | 必须是`String`或者`Symbol`                                   |
| 键的顺序 | 有序。迭代时，以插入顺序返回键值   | 无序。(ES6之后，对象保留了字符串和`Symbol`键的创建顺序；因此在只有字符串键的对象上迭代将按插入顺序产生建) |
| Size     | 通过size属性                       | 手动计算                                                     |
| 迭代     | Map是iterable的，可直接迭代        | 需要获取键值然后迭代键的方式进行迭代                         |
| 性能     | 频繁增删键值对的场景下性能更好     | 未对频繁增删操作做出优化                                     |

### 3.Map的属性

* `Map.prototype.constructor`：返回一个函数，创建了示例的原型。默认是`Map`函数
* Map.prototype.size：返回`Map`对象的键值对数量

### 4.Map的方法

* `Map.prototype.clear`：移除所有键值对
* `Map.prototype.delete(key)`：map存在则删除并返回`true`，否则返回`false`
* `Map.prototype.forEach(callback[, thisArg])`：forEach处理。如果提供了`thisArg`，则将`thisArg`作为回调中`this`值
* `Map.prototype.get(key)`：返回key对应的值，不存在返回`undefined`
* `Map.prototype.has(key)`：返回`true/false`，表示是否包含键对应的值
* `Map.prototype.keys()`：返回一个新的`Iterator`对象，按插入返回map中的键
* `Map.prototype.set(key, value)`：设置Map中键的值，返回该Map对象（IE11返回`undefined`）
* `Map.prototype.values()`：返回一个新的`Iterator`对象，按插入返回map中的值

### 5. Map迭代(for..of)

map是`Iterator`的，可直接使用`for..of`迭代

```javascript
let imap = new Map()
imap.set(0, 'z')
imap.set(1, 'x')

// 迭代map
for(let [key, value] of imap) { /* key, value迭代 */ }
// 迭代key
for(let key of imap.keys()) { /* key 迭代 */ }
// 迭代value
for(let value of imap.values()) { /* value 迭代 */ }

```

### 6. Map与数组的关系

可以使用`[key, value]`构成的二位数组，类似于`[[key1, value1], [key2, value2]]`与map相互转换

```javascript
let kva = [['key1', 'val1'], ['key2', 'val2']]
let kvmap = new Map(kva)

kvmap.get('key1') // val1
kvmap.get('key2') // val2

// 使用Array.from可将Map对象转为二维键值对数组
Array.from(kvmap) // [['key1', 'val1'], ['key2', 'val2']]
// 将map转为数组的简洁方式
[...kvmap] // [['key1', 'val1'], ['key2', 'val2']]

// 只将键取出来
Array.from(kvmap.keys()) || [...kvmap.keys()]
```

> 注意，我们可以为map对象添加自定义属性，为避免引起混乱，不建议这样做



## 二、WeakMap

在 JavaScript 里，map API 可以通过使其四个 API 方法共用两个数组(一个存放键,一个存放值)来实现。给这种 map 设置值时会同时将键和值添加到这两个数组的末尾。从而使得键和值的索引在两个数组中相对应。当从该 map 取值的时候，需要遍历所有的键，然后使用索引从存储值的数组中检索出相应的值。

但这样的实现会有两个很大的缺点，首先赋值和搜索操作都是 O(n) 的时间复杂度( n 是键值对的个数)，因为这两个操作都需要遍历全部整个数组来进行匹配。另外一个缺点是可能会导致内存泄漏，因为数组会一直引用着每个键和值。这种引用使得垃圾回收算法不能回收处理他们，即使没有其他任何引用存在了。

**相比之下，原生的 WeakMap 持有的是每个键对象的“弱引用”，这意味着在没有其他引用存在时垃圾回收能正确进行。原生 WeakMap 的结构是特殊且有效的，其用于映射的 key 只有在其没有被回收时才是有效的。**

正由于这样的弱引用，`WeakMap` 的 key 是不可枚举的 (没有方法能给出所有的 key)。如果key 是可枚举的话，其列表将会受垃圾回收机制的影响，从而得到不确定的结果。



## 三、Set

**Set**对象是值的集合，可以按照插入顺醋迭代它的元素。Set中元素只会出现一次，即Set中元素是唯一的。

**Set**中唯一性的比较方式与`Object.is`表现一致

### 1. Set属性

Set属性与Map类似，都包含一个size属性(返回Set包含元素数量)与一个构造函数(实例化set)

### 2. Set的方法

* `Set.prototype.add(value)`：在`Set`尾部添加一个元素。返回该Set对象(IE11返回Undefined)
* `Set.prototype.clear()`：移除Set内所有元素
* `Set.prototype.delete(value)`：移除Set内与value相等的元素。元素存在并移除返回true，否则返回false
* `Set.prototype.forEach(callback[, thisArg])`：forEach处理。如果提供了`thisArg`，则将`thisArg`作为回调中`this`值
* `Set.prototype.has(value)`：返回`true/false`，表示是否包含该元素
* `Set.prototype.keys()`：返回一个新的`Iterator`对象，按插入返回Set中的键
* `Set.prototype.values()`：返回一个新的`Iterator`对象，按插入返回Set中的值



## 四、WeakSet

`WeakSet` 对象是一些对象值的集合, 并且其中的每个对象值都只能出现一次。在`WeakSet`的集合中是唯一的

它和 [`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set) 对象的区别有两点:

- 与`Set`相比，`WeakSet` 只能是**对象的集合**，而不能是任何类型的任意值。
- `WeakSet`持弱引用：集合中对象的引用为弱引用。 如果没有其他的对`WeakSet`中对象的引用，那么这些对象会被当成垃圾回收掉。 这也意味着WeakSet中没有存储当前对象的列表。 正因为这样，`WeakSet` 是不可枚举的。

### WeakSet用处

**检测循环引用**：递归调用自身的函数需要一种通过跟踪哪些对象已被处理，来应对循环数据结构的方法。为此，WeakSet非常适合处理这种情况：因为一旦有循环引用，WeakSet.size则不为空。例如：

```javascript
// 对传入的subject对象内部的所有内容执行回调
function execRecursively(fn, subject, _refs = null) {
  if (!_refs) _refs = new WeakSet()
  // 避免无限递归
  if (_refs.has(subject)) return
  
  // 执行回调
  fu(subject)
  
  // 回调检测处理
  if (typeof subject === "object" && subject !== null) {
    _refs.add(subject)
    for (let key in subject) {
      execRecursively(fn, subject[key], _refs)
    }
  }
}

const foo = {
  foo: "Foo",
  bar: {
    bar: "bar"
  }
}
// 创建一个循环引用
foo.bar.baz = foo
// 可以避免循环打印
execRecursively(obj => console.log(obj), foo)
```

