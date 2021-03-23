import getRemoteComponent from './getRemoteComponent'
import getRequestProvider from './request'

const entry = async (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBModule> => {
  const { getModule } = RB_CONTEXT
  const asConstants = await getModule('asConstants') as AsConstants.IConsts
  const { ENV, LOCAL_STORAGE_PREFIX } = asConstants

  function getUrlByKey (key = '', type = ''): string {
    if (!key) {
      return key
    }

    if (/^(http:\/\/|https:\/\/)/.test(key)) {
      return key
    }

    return `${ENV.MEDIA_URL}${type}${key}`
  }

  function getLocalStorageItem (key: string): string {
    key = `${LOCAL_STORAGE_PREFIX}${key}`
    return localStorage.getItem(key)
  }

  function setLocalStorageItem (key: string, value: string): void {
    key = `${LOCAL_STORAGE_PREFIX}${key}`
    localStorage.setItem(key, value)
  }

  function removeLocalStorageItem (key: string): void {
    key = `${LOCAL_STORAGE_PREFIX}${key}`
    localStorage.removeItem(key)
  }

  function request (config: string | AsUtils.IReqConfig): Promise<unknown> {
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

  function safeParse (str: string): unknown {
    let ret
    try {
      ret = JSON.parse(str)
    } catch (e) {
      console.log(e)
    }

    return ret
  }

  function getUser (): AsUtils.IUser {
    let strMe = getLocalStorageItem('me')
    strMe = strMe ? window.atob(strMe) : ''
    const user = safeParse(strMe)

    return user as AsUtils.IUser
  }

  function getAuth (): AsUtils.IAuth {
    let strAuth = getLocalStorageItem('auth')
    strAuth = strAuth ? window.atob(strAuth) : ''
    const auth = safeParse(strAuth)

    return auth as AsUtils.IAuth
  }

  function getQueryParams (qs = ''): AsUtils.IObject {
    qs = qs.split('+').join(' ')

    const params = {}
    const re = /[?&]?([^=]+)=([^&]*)/g
    let tokens = re.exec(qs)

    while (tokens) {
      const key = decodeURIComponent(tokens[1])
      const val = decodeURIComponent(tokens[2])
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
  } as AsUtils.IUtils
}

export default {
  entry
}
