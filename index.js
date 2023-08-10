/**
 * @description MyPromise
 * @author arya
 */
class MyPromise {
  state = 'pending' // 状态 ，'pending' 'fulfilled' 'rejected'
  value = undefined //成功后的值
  reason = undefined //失败后的原因

  resolveCallbacks = [] //pending 状态下 存储成功的回调
  rejectCallbacks = [] // pending 状态下 存储失败的回调

  constructor(fn){
    const resolveHandler = (value) =>{
      if(this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.resolveCallbacks.forEach(fn => fn(this.value))
      }
    }

    const rejectHandler = (reason) => {
      if(this.state === 'pending'){
        this.state = 'rejected'
        this.reason = reason
        this.rejectCallbacks.forEach(fn => fn(this.reason))
      }
    }

    try {
      fn(resolveHandler, rejectHandler)
    } catch (err) {
      rejectHandler(err)
    }

  }
  then(fn1, fn2) {
    // fn1 fn2  在pending状态下会被存储到callbacks中
    fn1 = typeof fn1 === 'function' ? fn1 : (v) => v
    fn2 = typeof fn2 === 'function' ? fn2 : (e) => e
    
    if (this.state === 'pending') {
      const p1 = new MyPromise((resolve, reject) => {
        this.resolveCallbacks.push(() => {
          try {
            const newValue = fn1(this.value)
            resolve(newValue)
          } catch (err) {
            reject(err)
          }
        })

        this.rejectCallbacks.push(() => {
          try {
            const newReason = fn2(this.reason)
            reject(newReason)  // p1.reason
          } catch (err) {
            reject(err)
          }
        })
      })
      return p1
    }
    if (this.state === 'fulfilled') {
      const p1 = new MyPromise((resolve, reject) => {
        try {
          const newValue = fn1(this.value)
          resolve(newValue)
        } catch (err) {
          reject(err)
        }
      })
      return p1
    }
    if (this.state === 'rejected') {
      const p1 = new MyPromise((resolve, reject) => {
        try{
          const newReason = fn2(this.reason)
          reject(newReason) // p1.reason

        } catch (err) {
          reject(err)
        }
      })
      return p1
    }


  }

  // catch是then的语法糖，简单模式，then可以传两个参数，catch只能传一个失败
  catch(fn) { 
    return this.then(null, fn)
  }
}



