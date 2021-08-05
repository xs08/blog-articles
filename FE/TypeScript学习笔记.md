## Typescript 学习笔记

### Ts基本类型

ts支持js全部类型，此外还支持枚举类型。除基本类型`boolean`,  `number`,  `string`与js完全一样外， 有一下几种不同类型：

* js数组：对应ts有数组、元组两种类型

  1. 定义数组

    ```typescript
    // 1.直接定义数组
    let list: number[] = [1,2,3]
    // 2.使用数组泛型
    let list: Array<number> = [1,2,3]
    ```

  2. 定义元组(Tuple)：元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同

    ```typescript
    // 声明元组
    let x: [string, number]
    x2 = ['hello', 10] // ok
    x2 = [10, 'number'] // error
    
    // 当访问一个已知索引的元素，会得到正确的类型
    console.log(x[0].substr(1)); // OK
    console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
    
    // 当访问一个越界的元素，会使用联合类型替代
    x[3] = 'world'; // OK, 字符串可以赋值给(string | number)联合类型
    console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
    x[6] = true; // Error, 布尔不是(string | number)类型
    ```

    

* ts枚举：使用枚举类型可以为一组数值赋予友好的名字

  ```typescript
  enum Color {Red, Green, Blue}
  let c: Color = Color.Green;
  
  // 默认情况下，从0开始为元素编号。 你也可以手动的指定成员的数值
  enum Color {Red = 1, Green, Blue} // Red = 1, Green = 2, Blue = 3
  enum Color {Red = 1, Green = 2, Blue = 4} // Red = 1, Green = 2, Blue = 4
  
  // 枚举类型提供的一个便利是你可以由枚举的值得到它的名字
  enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2] // colorName: Green
  ```
  
* `any`类型：可以是任意类型

* `void`类型：与`any`类型相反，标识没有任何类型，通常当一个函数没有返回值时，声明一个`void`返回值。只能将`undefined`或者`null`赋值给`void`

* `null`与`undefined`类型：默认情况下，`null`与`undefined`是所有类型的子类型，也就是说可以将`null`与`undefined`赋值给任意类型。

  > ts配置指定了`--strictNullChecks`之后，`null`和`undefined`只能赋值给`void`和它们各自。 当想传值给 `string`或`null`或`undefined`，你可以使用联合类型`string | null | undefined`。(最好指定`--strictNullChecks`，避免很多没能发现的问题)

* `never`表示永不存在值的类型。例如， `never`类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；返回`never`的函数必须存在无法达到的终点

* `object`表示非原始类型，也就是除了`number`, `string`, `boolean`, `symbol`, `null`, `undefined`之外的类型

* 类型断言：类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。类型断言有两种方式：

  ```typescript
  // 方式一：“尖括号”语言
  let someValue: any = "this is a string"
  let strLength: number = (<string>someValue).length
  
  // 方式二：“as”语法
  let someValue: any = "this is a string"
  let strLength: number = (someValue as string).length
  ```

  

### 类型注解

一种轻量级的为函数或变量添加约束的方式

```typescript
function greeter(person: string) {}
```

> `person`只能是string类型，否则编译报错

### 接口

在TypeScript里，只在两个类型内部的结构兼容那么这两个类型就是兼容的。 这就允许我们在实现接口时候只要保证包含了接口要求的结构就可以，而不必明确地使用 `implements`语句

```typescript
interface Person {
  firstName: string;
  lastName: string;
}
function greeter(person: Person) {}
let user = { firstName: 'Jane', lastName: 'doe' };

greeter(user); // ok
```



### 类

ts支持基于类的面向对象编程。(在构造函数上使用`public`等同于`创建了同名的成员变量`)

```typescript
class Student {
  fullName: string;
  constructor(public firstName, public middleInitial, public lastName) {
    this.fullName = firstName + ' ' + middleInitial + ' ' + lastName
  }
}
interface Person {
  fistName: string;
  lastName: string;
}

function greeter(person: Person) {
  return 'Hello, ' + person.firstName + ' ' + person.lastName
}

let user = new Student('Jane', 'M', 'Doe')

greeter(user) // ok
```



