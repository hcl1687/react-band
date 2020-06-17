function delay (fun, tick = 100) {
  return new Promise(resolve => {
    setTimeout(() => {
      fun && fun()
      resolve()
    }, tick)
  })
}

export default {
  delay
}
