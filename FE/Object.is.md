## Object.is

ES6中将js引擎中`sameValueZeor`算法通过`Object.is(val1, val2)`暴露出来。此算法比较方式如下：

* `undefined`  ===  `undefined`
* `null` === `null`
* 两个值都是`true`或者`false`
* 两个值都指向同一个对象
* 对于数字的比较（`0`被认为是`+0`）：
  * `-0` === `-0`
  * `-0` != `0`并且 `-0` != `+0`(浏览器中`+0`与`-0`是相等的)
  * `NaN` == `NaN`
  * `x/0` === `y/0`



### 1. `Object.is`与`==`不同之处

`==`会对左右值做隐式转换。例如：`""` == `false`，对左值做了隐式转换



### 2. `Object.is`与 `===`不同之处

`Object.is`与`===`不同之处在于以下两点：

* `===`将数字值`+0`和`-0`视为相等(与`==`表现相同)
* `===`将`NaN`与`NaN`视为不等



## JavaScript中的比较

此处附上[MDN-JS中相等性判断](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)：

|          x          |          y          |  `==`   |  `===`  | `Object.is` |
| :-----------------: | :-----------------: | :-----: | :-----: | :---------: |
|     `undefined`     |     `undefined`     | √  | √  |   √    |
|       `null`        |       `null`        | √  | √  |   √    |
|       `true`       |       `true`       | √  | √  |   √    |
|       `false`       |       `false`       | √  | √  |   √    |
|       `"foo"`       |       `"foo"`       | √  | √  |   √    |
|         `0`         |         `0`         | √  | √  |   √    |
|        `+0`         |        `-0`         | √  | √  |   ❌   |
|         `0`         |       `false`       | √  | ❌ |   ❌   |
|        `""`         |       `false`       | √  | ❌ |   ❌   |
|        `""`         |         `0`         | √  | ❌ |   ❌   |
|        `"0"`        |         `0`         | √  | ❌ |   ❌   |
|       `"17"`        |        `17`         | √  | ❌ |   ❌   |
|       `[1,2]`       |       `"1,2"`       | √  | ❌ |   ❌   |
| `new String("foo")` |       `"foo"`       | √  | ❌ |   ❌   |
|       `null`        |     `undefined`     | √  | ❌ |   ❌   |
|       `null`        |       `false`       | ❌ | ❌ |   ❌   |
|     `undefined`     |       `false`       | ❌ | ❌ |   ❌   |
|  `{ foo: "bar" }`   |  `{ foo: "bar" }`   | ❌ | ❌ |   ❌   |
| `new String("foo")` | `new String("foo")` | ❌ | ❌ |   ❌   |
|         `0`         |       `null`        | ❌ | ❌ |   ❌   |
|         `0`         |        `NaN`        | ❌ | ❌ |   ❌   |
|       `"foo"`       |        `NaN`        | ❌ | ❌ |   ❌   |
|        `NaN`        |        `NaN`        | ❌ | ❌ |   √    |