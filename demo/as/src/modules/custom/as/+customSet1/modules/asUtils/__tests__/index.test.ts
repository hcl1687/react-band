import module from '../index.entry'

const asUtilsFactory = module.entry

const RB_CONTEXT: RB.IRBContext = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (type) => {
    if (type === 'asConstants') {
      return {
        ENV: {
          MEDIA_URL: 'https://test.com/'
        },
        LOCAL_STORAGE_PREFIX: 'AS_'
      }
    }
  }
}

describe('custom/as/asUtils', () => {
  it('check getUrlByKey', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { getUrlByKey } = asUtils

    expect(getUrlByKey()).toBe('')
    expect(getUrlByKey('http://www.test.com/a.jpg')).toBe('http://www.test.com/a.jpg')
    expect(getUrlByKey('https://www.test.com/a.jpg')).toBe('https://www.test.com/a.jpg')
    expect(getUrlByKey('a.jpg')).toBe('https://test.com/a.jpg')
    expect(getUrlByKey('a.jpg', 'img/')).toBe('https://test.com/img/a.jpg')
  })

  it('check getUrlByKey', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { getLocalStorageItem } = asUtils

    localStorage.setItem('AS_a', '1')
    expect(getLocalStorageItem('a')).toBe('1')
    localStorage.removeItem('AS_a')
  })

  it('check setLocalStorageItem', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { setLocalStorageItem } = asUtils

    setLocalStorageItem('a', '1')
    expect(localStorage.getItem('AS_a')).toBe('1')
    localStorage.removeItem('AS_a')
  })

  it('check removeLocalStorageItem', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { removeLocalStorageItem } = asUtils

    localStorage.setItem('AS_a', '1')
    removeLocalStorageItem('a')
    expect(localStorage.getItem('AS_a')).toBe(null)
  })

  it('check request', async () => {
    jest.mock('../request')
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const getRequestProvider = require('../request')
    getRequestProvider.mockImplementation(() => {
      return {
        get: (config) => {
          expect(config).toEqual(target)
        }
      }
    })
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { request } = asUtils

    let target
    target = {
      url: 'www.test.com',
      method: 'get'
    }
    request('www.test.com')

    target = {
      url: 'www.test.com',
      method: 'get',
      data: 'xx'
    }
    request({
      url: 'www.test.com',
      method: 'get',
      data: 'xx'
    })
  })

  it('check safeParse', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { safeParse } = asUtils

    expect(safeParse('{"a":1}')).toEqual({ a: 1 })
    expect(safeParse('')).toEqual(undefined)
  })

  it('check getUser', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { getUser } = asUtils

    const me = { name: 'test' }
    let strMe = JSON.stringify(me)
    strMe = btoa(strMe)
    localStorage.setItem('AS_me', strMe)
    expect(getUser()).toEqual({ name: 'test' })
  })

  it('check getAuth', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { getAuth } = asUtils

    const auth = { token: 'xxx' }
    let strAuth = JSON.stringify(auth)
    strAuth = btoa(strAuth)
    localStorage.setItem('AS_auth', strAuth)
    expect(getAuth()).toEqual({ token: 'xxx' })
  })

  it('check getQueryParams', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT) as AsUtils.IUtils
    const { getQueryParams } = asUtils

    const search = '?abc=123&efg=456'
    expect(getQueryParams(search)).toEqual({
      abc: '123',
      efg: '456'
    })
  })
})
