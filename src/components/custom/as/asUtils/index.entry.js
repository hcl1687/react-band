import getRequestProvider from './request'

export default async (RB_CONTEXT) => {
  const { getComponent } = RB_CONTEXT
  const asConstants = await getComponent('asConstants')
  const { ENV, LOCAL_STORAGE_PREFIX } = asConstants

  function getUrlByKey (key = '', type = '') {
    if (!key) {
      return key
    }

    if (/^(http:\/\/|https:\/\/)/.test(key)) {
      return key
    }

    // 'cudos/images/xxx.png' or '/cudos/images/xxx.png'
    if (/^\/?cudos\//.test(key)) {
      // covert 'cudos/images/xxx.png' to '/cudos/images/xxx.png'
      if (key[0] !== '/') {
        key = '/' + key
      }
      return `${ENV.MEDIA_URL}${key}`
    }

    return `${ENV.MEDIA_URL}${type}${key}`
  }

  function getLocalStorageItem (key) {
    key = `${LOCAL_STORAGE_PREFIX}${key}`
    return localStorage.getItem(key)
  }

  function setLocalStorageItem (key, value) {
    key = `${LOCAL_STORAGE_PREFIX}${key}`
    localStorage.setItem(key, value)
  }

  function removeLocalStorageItem (key) {
    key = `${LOCAL_STORAGE_PREFIX}${key}`
    localStorage.removeItem(key)
  }

  function request (config) {
    const token = getLocalStorageItem('cudos_token') || ''
    const instance = getRequestProvider(token)
    if (typeof config === 'string') {
      config = {
        url: config
      }
    }
    const method = config.method ? config.method.toLowerCase() : 'get'
    return instance[method](config)
  }

  function safeParse (str) {
    let ret
    try {
      ret = JSON.parse(str)
    } catch (e) {
      console.log(e)
    }

    return ret
  }

  function getUser () {
    let strMe = getLocalStorageItem('me')
    strMe = strMe ? window.atob(strMe) : ''
    const user = safeParse(strMe)

    return user
  }

  return {
    getUrlByKey,
    getLocalStorageItem,
    setLocalStorageItem,
    removeLocalStorageItem,
    request,
    safeParse,
    getUser
  }
}
