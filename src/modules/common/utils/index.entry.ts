function setStatic (key: string, value: string) {
  return BaseComponent => {
    BaseComponent[key] = value
    return BaseComponent
  }
}

function setDisplayName (displayName: string) {
  return setStatic('displayName', displayName)
}

function getDisplayName (Component: React.FC|React.ComponentClass|string) {
  if (typeof Component === 'string') {
    return Component
  }

  if (!Component) {
    return undefined
  }

  return Component.displayName || Component.name || 'Component'
}

function wrapDisplayName (BaseComponent: React.FC|React.ComponentClass|string, hocName: string) {
  return `${hocName}(${getDisplayName(BaseComponent)})`
}

function promisify (fun: (...args: Array<any>) => any) {
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

function getUrlParameter (url: string, name: string) {
  // eslint-disable-next-line
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(url)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export default (): RB.IRBModule => {
  return {
    setStatic,
    setDisplayName,
    getDisplayName,
    wrapDisplayName,
    promisify,
    getUrlParameter
  }
}
