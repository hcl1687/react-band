import module from '../index.entry'

const asUtilsFactory = module.entry

const RB_CONTEXT = {
  getModule: (type) => {
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
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { getUrlByKey } = asUtils

    expect(getUrlByKey()).toBe('')
    expect(getUrlByKey('http://www.test.com/a.jpg')).toBe('http://www.test.com/a.jpg')
    expect(getUrlByKey('https://www.test.com/a.jpg')).toBe('https://www.test.com/a.jpg')
    expect(getUrlByKey('a.jpg')).toBe('https://test.com/a.jpg')
    expect(getUrlByKey('a.jpg', 'img/')).toBe('https://test.com/img/a.jpg')
  })

  it('check getUrlByKey', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { getLocalStorageItem } = asUtils

    localStorage.setItem('AS_a', '1')
    expect(getLocalStorageItem('a')).toBe('1')
    localStorage.removeItem('AS_a')
  })

  it('check setLocalStorageItem', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { setLocalStorageItem } = asUtils

    setLocalStorageItem('a', '1')
    expect(localStorage.getItem('AS_a')).toBe('1')
    localStorage.removeItem('AS_a')
  })

  it('check removeLocalStorageItem', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { removeLocalStorageItem } = asUtils

    localStorage.setItem('AS_a', '1')
    removeLocalStorageItem('a')
    expect(localStorage.getItem('AS_a')).toBe(null)
  })

  it('check request', async () => {
    jest.mock('../request')
    const getRequestProvider = require('../request')
    getRequestProvider.mockImplementation((token) => {
      return {
        get: (config) => {
          expect(config).toEqual(target)
        }
      }
    })
    const asUtils = await asUtilsFactory(RB_CONTEXT)
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
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { safeParse } = asUtils

    expect(safeParse('{"a":1}')).toEqual({ a: 1 })
    expect(safeParse('')).toEqual(undefined)
  })

  it('check getUser', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { getUser } = asUtils

    let me = { name: 'test' }
    me = JSON.stringify(me)
    me = btoa(me)
    localStorage.setItem('AS_me', me)
    expect(getUser()).toEqual({ name: 'test' })
  })

  it('check getAuth', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { getAuth } = asUtils

    let auth = { token: 'xxx' }
    auth = JSON.stringify(auth)
    auth = btoa(auth)
    localStorage.setItem('AS_auth', auth)
    expect(getAuth()).toEqual({ token: 'xxx' })
  })

  it('check getQueryParams', async () => {
    const asUtils = await asUtilsFactory(RB_CONTEXT)
    const { getQueryParams } = asUtils

    const search = '?abc=123&efg=456'
    expect(getQueryParams(search)).toEqual({
      abc: '123',
      efg: '456'
    })
  })
})
