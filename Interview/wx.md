腾讯总监面算法题：
1. 反转二叉树
```javascript
const node = {
  Val: null,
  Left: null,
  Right: null
}

function reverseTree(tree) {
  if (!tree) return

  if (tree.Left && tree.Right) {
    let tmpNode = tree.Left
    tree.Left = tree.Right
    tree.Right = tmpNode
  
    reverseTree(tree.Left)
    reverseTree(tree.Right)
  }
}


function checkReverse(tree, rtree) {
  let result = true
  
  // 递归校验
  function checkReverseTree(tree, rtree) {
    if (!tree || !rtree) return
    if (tree.Val != rtree.Val) {
      result = false
      return
    }
  
    if (tree.Left) {
      if (rtree.Right) {
        if (tree.Left.Val == rtree.Right.Val) {
          checkReverseTree(tree.Left, rtree.Right)
        } else {
          result = false
          return
        }
      } else {
        result = false
        return
      }
    }
  
    if (tree.Right) {
      if (rtree.Left) {
        if (tree.Right.Val == rtree.Left.Val) {
          checkReverseTree(tree.Right, rtree.Left)
        } else {
          result = false
          return
        }
      } else {
        result = false
        return
      }
    }
  }

  checkReverseTree(tree, rtree)

  return result
}


const tree = {
  Val: 1,
  Left: {
    Val: 2,
    Left: {
      Val: 4,
    },
    Right: {
      Val: 5
    }
  },
  Right: {
    Val: 3,
    Left: {
      Val: 6
    },
    Right: {
      Val: 7
    }
  }
}
const rtree = JSON.parse(JSON.stringify(tree))
```

2. 字符串转数字：
```javascript
// 成功返回转换后的数字，否则返回null
function strToNum(str) {
  if (!str) return null

  const number = '0123456789'
  let result = 0
  let _str = ''

  for (let i = 0; i < str.length; i ++) {
    if (number.indexOf(str[i]) == -1) {
      return null
    }
    
    result *= 10

    let tmpNumber = str[i].charCodeAt(0) - '0'.charCodeAt(0)
    _str += str[i]

    result += tmpNumber
  }

  if (`${result}` == _str) {
    return result
  }
  return null
}

```