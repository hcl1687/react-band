function promisify (fun) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      try {
        const ret = fun(...args)
        if (ret && ret.then) {
          ret.then(resolve).catch(reject)
        } else {
          resolve(ret)
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}

function delay (fun, tick = 500) {
  return new Promise(resolve => {
    setTimeout(() => {
      fun && fun()
      resolve()
    }, tick)
  })
}

export default {
  setDisplayName: config => key => key,
  wrapDisplayName: key => key,
  promisify,
  delay
}
