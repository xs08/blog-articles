// generator执行器. async/await原理
const awaiter = function(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected(value) {
      try {
        step(generator['throw'](value))
      } catch (e) {
        reject(e)
      }
    }
    function step(result) {
      result.done ?
        resolve(result.value) :
        new P(function(res) {
          res(result.value)
        }).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}

function delay(ms, count) {
  return new Promise(res => {
    setTimeout(() => {
      res(count)
    }, ms)
  })
}

function dramaticWelcome() {
  return awaiter(this, void 0, void 0, function*() {
    console.log('Hello ')
    for (let i = 0; i < 5; i++) {
      // 等待Promise<any>转为数字
      const count = yield delay(1000, i)
      console.log(` ${count} `)
    }
    console.log(' World')
  })
}

dramaticWelcome()