## GO字符串相关处理-strings包

#### 1. 字符串s中是否存在某个字符或子串

* `func Contains(s, substr string) bool`，子串substr在s中，返回true
* `func ContainsAny(s, chars string) bool`，chars中任何一个Unicode代码点在s中，返回true。也就是说，第二个参数 chars 中任意一个字符（Unicode Code Point）如果在第一个参数 s 中存在，则返回true。
* `func ContainsRune(s string, r rune) bool`，Unicode代码点r在s中，返回true

#### 2. 字符串s中子串出现次数（字符串匹配）

* `func Count(s, sep string) int`，子串sep在s中出现的次数。特别说明一下当 sep 为空时，Count 的返回值是：utf8.RuneCountInString(s) + 1：

  ```go
  fmt.Println(strings.Count("five", "")) // output 5. before & after each rune
  ```

  另外，Count 是计算子串在字符串中出现的无重叠的次数（有重叠部分不计数）

#### 3. 字符串分割为[]string

Strings包提供了六个三组分割函数：Fields 和 FieldsFunc、Split 和 SplitAfter、SplitN 和 SplitAfterN用于实现字符串分割为slice。

* `func Fields(s string) []string`，使用空格分割字符串(空格定义：`unicode.IsSapce(rune) bool`)，结果不包含任何空格

* `func FieldsFunc(s string, f func(rune) bool) []string`，使用`f func(rune) bool`返回true的码点进行分割。可用`unicode.IsSapce`实现*Fields*函数:

  ```go
  func Fields(s string) []string {
      return FieldsFunc(s, unicode.IsSpace)
  }
  ```

一下几个方法都是内部由genSplit实现的，就放一起了。基本都是接受一个sep，返回一个[]string，如果sep为空，相当于分割成一个个的 UTF-8 字符。Split(s, sep) 和 SplitN(s, sep, -1) 等价；SplitAfter(s, sep) 和 SplitAfterN(s, sep, -1) 等价。

* `func Split(s, sep string) []string { return genSplit(s, sep, 0, -1) }`
* `func SplitAfter(s, sep string) []string { return genSplit(s, sep, len(sep), -1) }`

示例：

```go
fmt.Printf("%q\n", strings.Split("foo,bar,baz", ",")) // ["foo" "bar" "baz"]
fmt.Printf("%q\n", strings.SplitAfter("foo,bar,baz", ",")) // ["foo," "bar," "baz,"]
```

- `func SplitN(s, sep string, n int) []string { return genSplit(s, sep, 0, n) }`
- `func SplitAfterN(s, sep string, n int) []string { return genSplit(s, sep, len(sep), n) }`

带 N 的方法可以通过最后一个参数 n 控制返回的结果中的 slice 中的元素个数，当 n < 0 时，返回所有的子字符串；当 n == 0 时，返回的结果是 nil；当 n > 0 时，表示返回的 slice 中最多只有 n 个元素，其中，最后一个元素不会分割。

#### 4. 字符串是否含有某个前缀或后缀

这两个函数都挺简单的，源码如下：

```go
// s中是否有prefix前缀
func HasPrefix(s, prefix string) bool {
    return len(s) >= len(prefix) && s[0:len(prefix)] == prefix
}

// s中是否以suffix结尾
func HasSuffix(s, suffix string) bool {
    return len(s) >= len(suffix) && s[len(s) - len(suffix):] == suffix
}
```

#### 5. 字符或子串在字符串中出现的位置

一下这些函数与查找位置相关(从0开始计数)：

```go
// 在s中查找sep的第一次出现，返回第一次出现的索引
func Index(s, sep string) int
// chars中任何一个Unicode代码点在S中首次出现的位置
func IndexAny(s, chars string) int
// 查找字符c在s中第一次出现的位置，其中c满足f(c)返回true
func IndexFunc(s string, f func(rune) bool) int
// Unicode代码点r在s中第一次出现的位置
func IndexRune(s string, r rune) int

// 下面三个函数查找最后一次出现的位置
func LastIndex(s, sep string) int
func LastIndexAny(s, chars string) int
func LastIndexFunc(s string, f func(rune) bool) int
```

#### 6. 链接[]string为字符串

* `func Join(a []string, sep string) string`，使用sep将字符串slice连接起来

 可以自行实现：

```go
func Join(strs []string, sep string) string{
    if len(strs) == 0 {
        return ""
    }
    if len(strs) == 1 {
        return strs[0]
    }
    var buf bytes.Buffer
    for _, str := range strs {
        buf.WriteString(str)
        buf.WriteString(sep)
    }
    return buf.String()
}
```

标准库实现：

```go
func Join(strs []string, sep string) string {
    if len(strs) == 0 {
        return ""
    }
    if len(strs) == 1 {
        return strs[0]
    }
    n := len(sep) * (len(strs) - 1)
    for i := 0; i < len(strs); i ++ {
        n += len(strs[i])
    }
    b := make([]byte, n)
    bp := copy(b, strs[0])
    for _, str := range strs {
        bp += copy(bp, sep)
        bp += copy(bp, str)
    }
    return string(b)
}
```

为什么标准库实现没有使用bytes包？原因很简单，butes内部也是通过copy实现的😁

#### 7. 字符串重复、替换

* `func Repeat(s string, count int) string`，字符串s重复count后返回新的字符串
* `func Replace(s, old, new string, n int) string`，用new替换s中的old，一共替换n个。如果n<0，则不限制替换次数，简单来说就是全部替换。但是这个方法有局限性，不能一起替换多个字符串，接下来说这个

#### 8. Replacer类型

Replacer是一个结构，没有导出任何字段，实例化通过 `func NewReplacer(oldnew ...string) *Replacer` 函数进行，其中不定参数 oldnew 是 old-new 对，即进行多个替换。

解决上面说的替换问题：

```go
r := strings.NewReplacer("<", "&lt;", ">", "&gt;") // 将'<'替换成'&lt;'，将'>'替换成'&gt;'。
r.Replace("This is <b>HTML</b>!") // This is &lt;b&gt;HTML&lt;/b&gt;!
```

另外，Replacer 还提供了另外一个方法：

```go
func (r *Replacer) WriteString(w io.Writer, s string) (n int, err error)
```

它在替换之后将结果写入 io.Writer 中。

#### 9. Reader类型

如题，strings包实现了io.Reader接口，也就是实现了io.Reader（Read方法），io.ReaderAt（ReadAt 方法），io.Seeker（Seek 方法），io.WriterTo（WriteTo 方法），io.ByteReader（ReadByte 方法），io.ByteScanner（ReadByte 和 UnreadByte 方法），io.RuneReader（ReadRune 方法） 和 io.RuneScanner（ReadRune 和 UnreadRune 方法）。

Reader结构如下：

```go
type Reader struct {
    s        string    // Reader 读取的数据来源
    i        int // current reading index（当前读的索引位置）
    prevRune int // index of previous rune; or < 0（前一个读取的 rune 索引位置）
}
```

可见 Reader 结构没有导出任何字段，而是提供一个实例化方法：

```
func NewReader(s string) *Reader
```

该方法接收一个字符串，返回的 Reader 实例就是从该参数字符串读数据。bytes包中的 bytes.NewBufferString 功能类似，如果只为了读取，NewReader 效率会更好。