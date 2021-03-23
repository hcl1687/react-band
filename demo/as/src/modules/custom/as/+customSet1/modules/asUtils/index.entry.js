import getRemoteComponent from './getRemoteComponent'
import getRequestProvider from './request'

const entry = async (RB_CONTEXT) => {
  const { getModule } = RB_CONTEXT
  const asConstants = await getModule('asConstants')
  const { ENV, LOCAL_STORAGE_PREFIX } = asConstants

  function getUrlByKey (key = '', type = '') {
    if (!key) {
      return key
    }

    if (/^(http:\/\/|https:\/\/)/.test(key)) {
      return key
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

  function getAuth () {
    let strAuth = getLocalStorageItem('auth')
    strAuth = strAuth ? window.atob(strAuth) : ''
    const auth = safeParse(strAuth)

    return auth
  }

  function getQueryParams (qs = '') {
    qs = qs.split('+').join(' ')

    const params = {}
    const re = /[?&]?([^=]+)=([^&]*)/g
    let tokens = re.exec(qs)

    while (tokens) {
      var key = decodeURIComponent(tokens[1])
      var val = decodeURIComponent(tokens[2])
      params[key] = val
      tokens = re.exec(qs)
    }

    return params
  }

  return {
    getUrlByKey,
    getLocalStorageItem,
    setLocalStorageItem,
    removeLocalStorageItem,
    request,
    safeParse,
    getUser,
    getAuth,
    getRemoteComponent,
    getQueryParams
  }
}

export default {
  entry
}
