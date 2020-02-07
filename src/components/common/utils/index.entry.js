function setStatic (key, value) {
  return BaseComponent => {
    BaseComponent[key] = value
    return BaseComponent
  }
}

function setDisplayName (displayName) {
  return setStatic('displayName', displayName)
}

function getDisplayName (Component) {
  if (typeof Component === 'string') {
    return Component
  }

  if (!Component) {
    return undefined
  }

  return Component.displayName || Component.name || 'Component'
}

function wrapDisplayName (BaseComponent, hocName) {
  return `${hocName}(${getDisplayName(BaseComponent)})`
}

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

export default () => {
  return {
    setStatic,
    setDisplayName,
    getDisplayName,
    wrapDisplayName,
    promisify
  }
}
