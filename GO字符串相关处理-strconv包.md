## GO字符串相关处理-strconv包

### 一、错误类型

由于字符串转为其他类型有可能会出错，strconv定义了两个错误类型：*ErrRange* 和 *ErrSyntax*。ErrReange表示值超过该类型所能表示的最大范围(通常将字符串转为数字的时候，比如将"256"转为int16就会报错)，ErrSyntax表示语法错误，比如将"sss"转为int类型就会返回这个错误。

有时候只是提示语法错误或者是范围错误是不够完整了解错误消息的，一般情况下，我们还会对错误消息进行封装，比如提示那个函数、那一块发生了什么错误。strconv为我们做了一些工作，他定义了一个*NumbError*类型，并且他自己也实现了*Error*接口：

```go
// A NumError records a failed vonversion
type NumError struct {
  Func string // the failing function e.g. ParseBool、ParseInt、ParseUint、ParseFloat
  Num  string // the input
  Err  error  // the reason of conversion failed, ErrRange、ErrSyntax
}

func (e *NumError) Error() string {
  return "strconv." + e.Func + ": " + "parsing" + Quote(e.Num) + ": " + e.Err.Error()
}
```

而且在包里面实现了两个便捷函数，用于构造 *NumError*，遇到 ErrSyntax 或 ErrRange 可用这两个函数构造 NumError：

```go
// ErrSyntax
func syntaxError (fn, str string) *Number { return &NumError{fn, str, ErrSyntax} }
// ErrRange
func rangeError (fn, str string) *Number { return &NumError{fn, str, ErrRange} }
```

### 二、转换函数

#### 1. 字符串与布尔值互转

* `func FormatBool(b bool) string`，布尔值转换为字符串true或者 false

* `func ParseBool(str string) (bool, error)`，字符串转换为布尔值: 1、t、T、TRUE、true、True返回True；0、f、F、FALSE、false、False返回False。其他全部错误

* `func AppendBool(dst []byte, b bool)`，将"true"或"false"追加到dst中，这用了append函数对于字符串的用法：`append(dst, "true"...)`

#### 2. 字符串转为整形

字符串转为整形主要包含三个函数：

* `func ParseInt(s string, base int, bitSize int) (i int64, err error)`
* `func ParseUint(s string, base int, bitSize int) (i int64, err error)`
* `func Atoi(s string)(i int64, err error)`

*ParseInt* 与 *ParseUint* : 整数转换为字符串形式，有符号&无符号：base表示进制，取值在2到36之间，大于10的数字用a-z表示。如果 base 的值为 0，则会根据字符串的前缀来确定 base 的值："0x" 表示 16 进制； "0" 表示 8 进制；否则就是 10 进制。



```go

func FormatInt(i int64, base int) string

func FormatUint(i uint64, base int) string

```

* 字符串解析为整数。ParseInt支持正负号，ParseUint不支持；base便是进制（2-32）, 如果base为0， 根据字符串前缀判断，0x十六进制，0八进制，否则是十进制；bitSize表示结果位宽，0表示最大位宽

```go

func ParseInt(s string, base int, bitSize int) (i int64, err error)

func ParseUint(s string, base int, bitSize int) (uint64, error)

```

* 整数转换为十进制字符串形式

```go

// FormatInt(i, 10)简写

func Itoa(i int) string

```

* 字符串转换为十进制形式

```go

// ParseInt(s, 10, 0) 简写

func Atoi(s string) (int, error)

```

* 浮点数转换为字符串形式

```go

// fmt:格式标记[b:二进制指数，e:十进制指数，E:十进制指数，f:没有指数，g:(e:大指数，f:其他情况)， G:（e:大指数，f:其他情况）]

// perc: 精度；如果fmt为e,E,f则prec表示小数点后的数字位数；fmt为g,G则prec表示总的数字位数(整数部分+小数部分)

func FormatFloat(f float64, fmt byte, prec, bitSize int) string

```

* 字符串转换为浮点数形式，使用IEEE754标准舍入。bitSize取值有32和64两种，表示转换结果精度。语法错误：`err.Error = ErrSyntax`, 超出范围：`err.Error = ErrRange`

```go

func ParseFloat(s string, bitSize int) (float64, error)

```

* 字符串是否含有控制字符（除了t）和反引号字符

```go

func CanBackquote(s string) bool

```

* 判断r是否为可打印字符字符（除了t等）,rune[int32]指明值是一个Unicode码点，byte是[uint8]

```go

func isPrint(r rune) bool

```

* 判断r是否为Unicode定义的圆形字符

```go

func IsGraphic(r rune) bool

```

* 将s转换为双引号字符串

```go

func Quote(s string) string

```

* 将s转换为双引号字符串，非ASCII字符和不可打印字符会被转义

```go

func QuoteToASCII(s string) string

```

* 将s转换为双引号字符串，非图形字符会被转义

```go

func QuoteToGraphic(s string) string

```

* 将r转换为单引号字符

```go

func QuoteRune(r rune) string

```

* 将r转换为单引号字符，非ASCII字符和不可打印字符会被转义

```go

func QuoteRuneToACSII(r rune) string

```

* 将r转换为单引号字符，非图形字符会被转义

```go

func QuoteRuneToGraphic(r rune) string

```

* 将带引号（单引号、双引号、反引号）的字符串转换为常规字符串（不包括引号和转义字符），如果S是单引号引起来的字符串，则返回该字符串代表的字符

```go

func Unquote(s string) (string, error)

```

* 将带引号字符串（不包含首尾引号）中的第一个字符“取消转义”并解码

```go

// s:带引号的字符串（不包含首尾引号）；quote:字符串使用的“引号符”（对于字符串中的引号符取消转义）

// value: 解码后的字符；multibute: value是否为多字节字符；tail：s剩余部分；err：s中是否存在语法错误

// 参数quote引号符，如果设置单引号，则s中允许出现'、"字符，不允许出现单独的'字符

// 参数quote引号符，如果设置双引号，则s中允许出现"、'字符，不允许出现单独的"字符

// 如果设置为0, 则不允许出现'或"字符，但可以出现单独'或"字符

func UnquoteChar(s string, quote byte) (value rune, multibute bool, tail string, err error)

```

* 将各种类型转换为字符串后追加到dst尾部

```go

func AppendInt(dst byte[], i int64, base int) []byte

func AppendUint(dst byte[], i uint64, base int) []byte

func AppendFloat(dst byte[], i float64, fmt byte, prec, bitSize int) []byte

func AppendBool(dst byte[], b bool) []byte

```

* 将各种类型转换为带引号的字符串后追加到dst尾部

```go

func AppendQuote(dst []byte, s string) []byte

func AppendQuoteToASCII(dst []byte, s string) []byte

func AppendQuoteToGraphic(dst []byte, s string) []byte

func AppendQuoteRune(dst []byte, r rune) []byte

func AppendQuoteRuneToASCII(dst []byte, r rune) []byte

func AppendQuoteRuneToGraphic(dst []byte, r rune) []byte

```