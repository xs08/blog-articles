// 并发调度器
class Scheduler {
  constructor(concurrency, autoRun = false) {
    this._conLimit = concurrency > 1 ? concurrency : 1
    this._allTasks = []
    this._runningTask = 0
    this._autoRun = autoRun
  }

  // 清理任务
  _clearTask(index) {
    if (this._allTasks[index]) {
      this._allTasks[index].status = 'finish'
      this._runningTask -= 1

      this._allTasks.splice(index, 1)
    }

    // 执行下一个任务
    this._execute()
  }

  // 执行task
  _execute() {
    if (this._allTasks && // 是否有任务
      (this._runningTask < this._conLimit) && // 是否达到并发条件
      (this._allTasks.length > this._runningTask) // 是否已经全部运行了
    ) {
      for (let i = 0; i < this._allTasks.length; i++) {
        // 找到一个可以执行的任务
        if (this._allTasks[i].status === '') {
          const nextTask = this._allTasks[i]
          nextTask.status = 'pending'

          const { resolve, reject, task } = nextTask
          // 执行任务
          task().then(res => {
            resolve(res)
            this._clearTask(i)
          }).catch(err => {
            reject(err)
            this._clearTask(i)
          })
          
          this._runningTask += 1
          // 检查是否需要再次开启一个任务
          setTimeout(() => { this._execute() })
          return
        }
      }
    }
  }

  // 添加一个任务
  // Task {status: none, pending, finish; task, resolve, reject}
  addTask(task) {
    let resolve = () => {}
    let reject = () => {}

    const stsPromise = new Promise((res, rej) => { resolve = res, reject = rej })
    this._allTasks.push({
      task,
      resolve,
      reject,
      status: '',
    })

    if (this._autoRun) {
      setTimeout(() => { this._execute() })
    }

    return stsPromise
  }

  // 外部执行任务
  run () {
    if (!this._autoRun) {
      this._execute()
    }
  }
}


/* Use Example */
// const scheduler = new Scheduler(3, true)

// const addTask = (id, scheduler) => {
//   scheduler.addTask(
//     () => new Promise((resolve, reject) => setTimeout(() => resolve(id), 2000))
//   ).then(id => console.log(`task ${id} down`))
//   .catch(err => console.log(`task ${id} fail`))
// }

// addTask(1, scheduler)
// addTask(2, scheduler)
// addTask(3, scheduler)
// addTask(4, scheduler)
// addTask(5, scheduler)
// addTask(6, scheduler)
// addTask(7, scheduler)
// addTask(8, scheduler)

// // 非自动执行时可以调用
// scheduler.run()

