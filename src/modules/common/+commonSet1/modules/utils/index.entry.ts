function setStatic (key: string, value: string): Utils.IComponentDeco {
  return BaseComponent => {
    BaseComponent[key] = value
    return BaseComponent
  }
}

function setDisplayName (displayName: string): Utils.IComponentDeco {
  return setStatic('displayName', displayName)
}

function getDisplayName (Component: RB.IRBComponent|string): string|undefined {
  if (typeof Component === 'string') {
    return Component
  }

  if (!Component) {
    return undefined
  }

  return Component.displayName || Component.name || 'Component'
}

function wrapDisplayName (BaseComponent: RB.IRBComponent|string, hocName: string): string {
  return `${hocName}(${getDisplayName(BaseComponent)})`
}

function promisify (fun: (...args: Array<any>) => any): ((...args: Array<any>) => Promise<any>) {
  return (...args: Array<any>) => {
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

function getUrlParameter (url: string, name: string): string {
  // eslint-disable-next-line
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(url)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

const entry = (): RB.IRBModule => {
  return {
    setStatic,
    setDisplayName,
    getDisplayName,
    wrapDisplayName,
    promisify,
    getUrlParameter
  }
}

export default {
  entry
}
