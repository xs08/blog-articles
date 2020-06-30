// 跳台阶问题
function steps(n) {
  const arr = [0, 1, 2]
  if (arr[n]) {
    return arr[n]
  }

  for (let i = 3; i <= n; i++) {
    arr.push(arr[i - 1] + arr[i - 2])
  }
  return arr[n]
}

// 机器人走到右下角问题
function robbitMove(m, n) {
  if (!m || !n) {
    return 0
  }
  const subArr0 = new Array(n)
  subArr0.fill(1)
  const subArr1 = new Array(n)
  subArr1.fill(0)
  subArr1[0] = 1

  const pathArr = [
    subArr0
  ]
  for (let i = 1; i < m; i++) {
    pathArr.push([ ...subArr1 ])
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      pathArr[i][j] = pathArr[i-1][j] + pathArr[i][j-1]
    }
  }

  return pathArr[m - 1][n -1]
}

// 机器人走到右下角问题．优化空间占用．
function robbitMove(m, n) {
  if (!m || !n) {
    return 0
  }
  const subArr = new Array(n)
  subArr.fill(1)
 
  for (let i = 1; i < m; i++) {
    subArr[0] = 1
    for (let j = 1; j < n; j++) {
      subArr[j] = subArr[j - 1] + subArr[j]
    }
  }

  return subArr[n -1]
}

// 生成一个随机二维数组
function genPath(m, n) {
  const arr = []
  for (let i = 0; i < m; i++) {
    arr.push(new Array(n))
    for (let j = 0; j < n; j++) {
      arr[i][j] = Math.round(Math.random() * 50)
    }
  }
  return arr
}

// 左上角到右下角和最小
function pathMinSum(pathArr) {
  console.log(pathArr)

  if (!pathArr.length || !pathArr[0].length) {
    return 0
  }
  const rowNumber = pathArr.length
  const colNumber = pathArr[0].length

  let firstRow = []
  firstRow.push(pathArr[0][0])
  for (let i = 1; i < colNumber; i++) {
    firstRow.push(pathArr[0][i] + firstRow[i - 1])
  }

  let tmpArr = new Array(colNumber)
  tmpArr.fill(0)

  const solvedArr = [
    firstRow
  ]
  for (let i = 1; i < rowNumber; i++) {
    solvedArr.push([ ...tmpArr ])
  }

  for (let i = 1; i < rowNumber; i++) {
    solvedArr[i][0] = solvedArr[i - 1][0] + pathArr[i][0]
  }

  for (let i = 1; i < rowNumber; i++) {
    for (let j = 1; j < colNumber; j++) {
      solvedArr[i][j] = Math.min(solvedArr[i-1][j], solvedArr[i][j-1]) + pathArr[i][j]
    }
  }

  console.log(solvedArr)
}