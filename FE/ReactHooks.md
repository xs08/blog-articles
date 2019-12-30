## React，Hooks用起来!

随着React的发展，新版本的React提供了一系列的API（Hooks）来加速开发者构建应用(自React16.8起)。那么Hooks是什么呢？简单来说，Hooks提供了让开发者在**无状态组件**中使用**state**的能力。听起来是非常炫酷的哈，我们一起来看看这些神奇的Hooks怎样使用吧

### Hooks有哪些

React提供的API总共有10个，其中基础的有三个分别是：`useState`、`useEffect`、`useContext`；额外的7个分别是：`useReducer`、`useCallback`、`useMemo`、`useRef`、`useImperativeHandle`、`useLayoutEffect`、`useDebugValue`，这些Hooks提供的能力使得构建应用的时候又多了很多的想法。基础的Hooks是开发中经常用到的，额外的Hooks提供的能力是为了补充无状态组件在构建应用的生命周期方法中的空白而提供的，如果这里没有太明白咋回事问题不太，且看看下面介绍完用法之后自然也就明白怎么回事了。文章较长，慢慢来不急

### 基础Hooks

* **`useState`**：`useState`返回一个**state**, 以及更新state的函数。用法如下：

```js
const [state, setState] = useState(initialState)
```

传入的**initialState**可以只是初始化的数据，也可以是一个函数，在函数中计算并返回初始的 state。这个函数只会在初次渲染的时候被调用（成为惰性初始化）：

```js
const [state, setState] = useState(() => {
  const initialState = {a:'foo'}
  // ...初始化数据操作
  initialState.b = 'aoo'
  return initialState
})
```

返回值中的**state**使用方式与状态组件中**state**使用方式相同，可直接进行页面渲染。**setState**方法使用用来更改**state**的，与状态组件**setState**类似，不同的是**这里`setState`会使用传入的参数更改整个`state`数据**。有些时候，更改**state**需要使用之前的**state**状态，这里可以给`setState`传入一个参数为**prevState**的callback(这个`callback`需要返回一个新的**state**), React会将之前的state传入，以此来生成新的state。使用`useState`构建一个简单的计数器如下：

```jsx
function Counter({ initialCount }) {
  const [count, setCount] = useState(initialCount)
  return (
  	<>
    	Count: {{count}}
  		<button onClick={() => setCount(initialCount)}>Reset</button>
  		<button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
  		<button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  )
}
```

> 与 class 组件中的 `setState` 方法不同，`useState` 不会自动合并更新对象。你可以用函数式的 `setState` 结合展开运算符来达到合并更新对象的效果
>
> ```js
> setState(prevState => ({ ...prevState, ...newValue }))
> ```
>
> 也可以使用下面介绍的`useReducer` ，它更适合用于管理包含多个子值的 state 对象

* **`useEffect`**：`useEffect`返回



### 额外的Hooks

额外的Hooks是为了补充无状态组件没有生命周期函数、没有refs引用、补充基础Hooks不足等方面而提供的。有的会在特殊的情况下用到，当了解之后自然会知道在什么地方需要用到他们。

* **`useReducer`**：**useReducer**提供了使用**useState**的另一种选择，他也是为了管理组件**state**而生的，正如他的名字一般，提供了**Reducer**的方式来管理**state**。它的基本用法如下(它的概念与`Redux`类似的，不熟悉的话建议先了解一下)：

  ```js
  const [state, dispatch] = useReducer(reducer, initialArg, init)
  ```

  > 使用**useReducer**某些情况下比**useState**更好的，因为可以将**dispatch**转入子组件，从而可以优化那些需要深更新的组件性能

  使用**userReducer**重写计数器组件如下：

  ```jsx
  function Counter({ initialCount }) {
    const initialState = { count: initialCount }
    const reducer = (state, action) => {
      switch(action.type) {
        case 'add': return { count: state.count + 1 }
        case 'sub': return { count: state.count - 1 }
        default: new Error("action err")
      }
    }
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
    	<>
      	Count: {{state.count}}
    		<button onClick={() => dispatch({ type: 'add' })}>+</button>
    		<button onClick={() => dispatch({ type: 'sub' })}>-</button>
      </>
    )
  }
  ```

  > React会确保dispatch函数标识是稳定的，也就是说dispatch函数并不会随着函数重新渲染而重新生成，一旦生成之后就不会在变了。所以，在`useEffect`或者`useCallback`里面可以安全的省略掉`dispatch`

  与`useState`类似，`useReducer`也有惰性初始化方式。使用方式就是`useReducer`第二个参数传入callback, 第三个参数传入初始化state的参数，如下示例：

  ```jsx
  const init = (initialCount) => ({count: initialCount})
  
  function reducer(state, action) {
    switch (action.type) {
      case 'reset':
        return init(action.payload)
      default:
        throw new Error()
    }
  }
  
  function Counter({initialCount}) {
    const [state, dispatch] = useReducer(reducer, initialCount, init)
    return (
      <>
        Count: {state.count}
        <button onClick={() => dispatch({type: 'reset', payload: initialCount})}>
          Reset
        </button>
      </>
    )
  }
  ```

  > 这么做可以将用于计算 state 的逻辑提取到 reducer 外部，这也为将来对重置 state 的 action 做处理提供了便利。需要注意的是：**如果dispatch执行之后的state返回值与当前state相同，React将跳过子组件的渲染及副作用的执行(React使用[Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)来比较state)**，这种行为成为跳过dispatch。需要注意的是，这种情况下React可能仍然需要在跳过渲染前再次渲染该组件，不过由于React不会对组件树的“深层”节点进行不必要的渲染，所以也不用担心会对性能造成什么影响。如果应用的组件在渲染期间执行了高开销的计算的话，我们则可以使用**useMemo**来进行优化

  

* **`useCallback`**：**useCallback**就是用来返回一个**memoized**了的函数。使用方式如下：

  ```js
  const memoizedCallbeck = useCallback(() => {
    doSomething(a, b)
  }, [a, b])
  ```

  传入两个参数，一个callback，一个依赖列表，返回一个**memoized**的函数。只有当依赖列表中的数据发生更改之后，这个函数才会更新。当把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

  `useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`

  > 依赖项数组不会作为参数传给回调函数。虽然从概念上来说它表现为：所有回调函数中引用的值都应该出现在依赖项数组中。未来编译器会更加智能，届时自动创建数组将成为可能

  

* **`useMemo`**：`useMemo`返回一个**memoized**了的值，使用方式如下：

  ```js
  const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
  ```

  把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

  > 记住，传入 `useMemo` 的函数会在渲染期间执行。不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 `useEffect` 的适用范畴，而不是 `useMemo`。如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值。
  >
  > **可以把 `useMemo` 作为性能优化的手段，但不要把它当成语义上的保证**，将来，React 可能会选择“遗忘”以前的一些 memoized 值，并在下次渲染时重新计算它们，比如为离屏组件释放内存。先编写在没有 `useMemo` 的情况下也可以执行的代码 —— 之后再在你的代码中添加 `useMemo`，以达到优化性能的目的

  

* **`useRef`**：`useRef`有两种用法：一种是保存初始化时对象的引用，这个对象在整个组件的生命周期内保持不变；另一种是类似于class组件ref的使用方式，`useRef`返回Ref对象的`.current`指向渲染到页面的DOM元素，不论这个DOM元素如何更改，这个Ref对象的`.current`永远指向它，且不会改变

  > `useRef`用作保存对象引用的时候，它可以很方便的保存任何可变的值，且他在每次渲染的时候都会返回同一个ref对象。但是当ref的值改变的时候，`useRef`并不会通知我们。所以如果想要在React解绑或者解绑DOM节点的ref的时候运行某些代码，这时候就需要回调ref来实现。回调ref就是使用`useCallback`来实现一个ref的引用。具体示例可以看文档[我该如何测量DOM节点?](https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node)

  

* **`useImpertiveHandle`**：`useImperativeHandle` 可以在使用 `ref` 时自定义暴露给父组件的实例值。函数签名如下：`useImperativeHandle(ref, createHandle, [deps])`，通常需要与`forwardRef`一起使用。下面看个具体的例子就明白啦：

  ```js
  const FancyInput = forwardRef((props, ref) => {
    const inputRef = useRef()
    useImpertiveHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus()
      }
    }))
    return <input ref={inputRef} ...props />
  })
  ```

  这样操作之后，渲染的组件`<FancyInput ref={fancyInputRef} />`则可以使用`fancyInputRef.current.focus()`方法了

* **`useLayoutEffect`**：此Hook的函数签名与`useEffect`函数签名相同，这个函数会在所有DOM变更之后同步调用传入的effect函数，可以使用这个函数来读取DOM的布局并触发同步渲染。在浏览器的绘制开始之前，`useLayoutEffect`内部的更新也会同步执行。简单来说**`useLayoutEffect`的执行时机是组件的DOM渲染结束之后**，他的调用阶段与class组件的`componentDidMount`、`componentDidUpdate`执行阶段是一样的。

  > 这里更推荐使用`useEffect`来达到页面同步更新，`useLayoutEffect`会有一定的页面阻塞

  

* **`useDebugValue`**：`useDebugValue`可用于在React开发者工具中显示自定义hook的标签

基础的ReactHooks用法就到这里啦，知道怎样用了吗？



### 引用文档

* [印记中文React文档](https://react.docschina.org/)
* [Hooks-API Reference](https://reactjs.org/docs/hooks-reference.html)