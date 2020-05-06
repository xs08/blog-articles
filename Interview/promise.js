const PENDING = Symbol('PENDING')
const FULLFILLED = Symbol('FULLFILLED')
const REJECTED = Symbol('FULLREJECTED')

class SPromise {
  constructor(executor) {
    this.state = PENDING
    this.value = null
    this.reson = null

    // 存放成功回调的函数
    this.onFulFilledCallbacks = []
    // 存放失败回调的函数
    this.onRejectedCallbacks = []

    // resolve函数
    const resolve = (value) => {
      if (this.state === PENDING) {
        this.value = value
        this.state = FULLFILLED
        this.onFulFilledCallbacks.map(fn => fn())
      }
    }

    const reject = (value) => {
      if (this.state === PENDING) {
        this.reson = value
        this.state = REJECTED
        this.onRejectedCallbacks.map(fn => fn())
      }
    }

    // executor 可能抛出错误，需要扑获一下
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  resolvePromise(promise2, x, resolve, reject) {
    let self = this;
    let called = false; // called 防止多次调用
    //因为promise2是上一个promise.then后的返回结果，所以如果相同，会导致下面的.then会是同一个promise2，一直都是，没有尽头
    //相当于promise.then之后return了自己，因为then会等待return后的promise，导致自己等待自己，一直处于等待
    if (promise2 === x) {
        return reject(new TypeError('循环引用'));
    }
    //如果x不是null，是对象或者方法
    if (x !== null && (Object.prototype.toString.call(x) === '[object Object]' || Object.prototype.toString.call(x) === '[object Function]')) {
        // x是对象或者函数
        try {
            let then = x.then;

            if (typeof then === 'function') {
                then.call(x, (y) => {
                    // 别人的Promise的then方法可能设置了getter等，使用called防止多次调用then方法
                    if (called) return;
                    called = true;
                    // 成功值y有可能还是promise或者是具有then方法等，再次resolvePromise，直到成功值为基本类型或者非thenable
                    self.resolvePromise(promise2, y, resolve, reject);
                }, (reason) => {
                    if (called) return;
                    called = true;
                    reject(reason);
                });
            } else {
                if (called) return;
                called = true;
                resolve(x);
            }
        } catch (reason) {
            if (called) return;
            called = true;
            reject(reason);
        }
    } else {
        // x是普通值，直接resolve
        resolve(x);
    }
  }

  then(onFulfilled, onRejected) {
    //解决onFulfilled,onRejected没有传值的问题
    const onFulfilledCallback = typeof onFulfilled === 'function' ? onFulfilled : y => y
    //因为错误的值要让后面访问到，所以这里也要跑出个错误，不然会在之后then的resolve中捕获
    const onRejectedCallback = typeof onRejected === 'function' ? onRejected : err => { throw err }

    // if (this.state === FULLFILLED) {
    //   onFulfilledCallback(this.value)
    // }

    // if (this.state === REJECTED) {
    //   onRejectedCallback(this.reson)
    // }

    // if (this.state === PENDING) {
    //   this.onFulFilledCallbacks.push(() => {
    //     onFulfilledCallback(this.value)
    //   })

    //   this.onRejectedCallbacks.push(() => {
    //     onRejectedCallback(this.reason)
    //   })
    // }

    const This = this
    const tmpPromise = new SPromise((resolve, reject) => {
      if (This.state === PENDING) {
        This.onFulFilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilledCallback(This.value)
              This.resolvePromise(tmpPromise, x, resolve, reject)
            } catch (reson) { reject(reson) }
          }, 0)
        })

        This.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejectedCallback(This.reson)
              This.resolvePromise(tmpPromise, x, resolve, reject)
            } catch (reson) { reject(reson) }
          }, 0)
        })
      }

      if (This.status === FULLFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilledCallback(This.value)
            This.resolvePromise(tmpPromise, x, resolve, reject)
          } catch (reson) { reject(reson)}
        }, 0)
      }

      if (This.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejectedCallback(This.reason)
            This.resolvePromise(tmpPromise, x, resolve, reject)
          } catch (reson) { reject(reson) }
        }, 0)
      }
    })

    return tmpPromise
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(callback) {
    return this.then(value => {
      callback()
      return value
    }, reason => {
      callback()
      return reason
    })
  }

  static resolve(val) {
    return new SPromise((res) => { res(val) })
  }

  static reject(val) {
    return new SPromise((_, rej) => { rej(val) })
  }

  static all(promiseArr) {
    return new SPromise((resolve, reject) => {
        let result = [];

        promiseArr.forEach((promise, index) => {
            promise.then((value) => {
                result[index] = value;

                if (result.length === promiseArr.length) {
                    resolve(result);
                }
            }, reject);
        });
    });
  }

  static race(promiseArr) {
    return new SPromise((resolve, reject) => {
        promiseArr.forEach(promise => {
            promise.then((value) => {
                resolve(value);
            }, reject);
        });
    });
  }

  static deferred() {
    let dfd = {};
    dfd.promies = new SPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.rfeject = reject;
    });
    return dfd;
  }
}