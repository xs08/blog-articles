// 二叉树路径和

const Tree = {
  Left: null, // Node
  Right: null, // Node
  Val: 0, // Number
}

//      5
//      /\
//     8  10
//    /\  /\
//  12 5  9 10
//   /  \   \
//   3  7    15

// 广度优先遍历二叉树
const GetBTreeSumOfPath = (tree, sum) => {
  const stack = []
  stack.push(tree)
  while(stack.length) {
    const tmp = stack.shift()
    console.log(`Node Val: `, tmp.Val)
    if (tmp.Left) stack.push(tmp.Left)
    if (tmp.Right) stack.push(tmp.Right)
  }
}

// 深度有限遍历二叉树
const GetBTreeSumOfPathD = (tree, sum) => {
  const stack = []
  let tmpNode = tree
  while(tmpNode || stack.length) {
    while(tmpNode) {
      console.log(`Node Val:`, tmpNode.Val)
      stack.push(tmpNode)
      tmpNode = tmpNode.Left
    }

    if (stack.length) {
      tmpNode = stack.pop()
      tmpNode = tmpNode.Right
    }
  }
}

// 求路劲和
const hasVal = (tree, sum, path = []) => {
  if (!tree) {
    return ''
  }
  const _path = [ ...path ]
  _path.push(tree.Val)
  
  if (!tree.Left && !tree.Right) {
    if (sum == tree.Val) {
      return _path
    }
    return ''
  }
  if (tree.Left && !tree.Right) {
    return hasVal(tree.Left, sum - tree.Val, _path)
  }
  if (!tree.Left && tree.Right) {
    return hasVal(tree.Right, sum - tree.Val, _path)
  }

  return hasVal(tree.Left, sum - tree.Val, _path) || hasVal(tree.Right, sum - tree.Val, _path)
}

const tree = {
  Val: 5, // 30
  Left: {
    Val: 8, // 25
    Left: {
      Val: 12, // 17
      Left: {
        Val: 3 // 5
      }
    },
    Right: {
      Val: 5, // 25
      Right: {
        Val: 7 // 20
      },
    },
  },
  Right: {
    Val: 10, // 25
    Left: {
      Val: 9 // 15
    },
    Right: {
      Val: 10, // 15
      Right: {
        Val: 15, // 15
      }
    },
  }
}


// GetBTreeSumOfPath(tree, 40)
// GetBTreeSumOfPathD(tree, 40)
console.log((hasVal(tree, 40) || []).join('->'))
// 5 -> 10 -> 10 -> 15