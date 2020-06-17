import utilsFactory from '../index.entry'

const utils = utilsFactory()

describe('common/utils', () => {
  it('setStatic should work correctly', () => {
    const { setStatic } = utils
    const test = function () {}
    const ret = setStatic('a', 'b')(test)
    expect(ret.a).toEqual('b')
    expect(ret).toEqual(test)
  })

  it('setDisplayName should work correctly', () => {
    const { setDisplayName } = utils
    const test = function () {}
    const ret = setDisplayName('test')(test)
    expect(ret.displayName).toEqual('test')
    expect(ret).toEqual(test)
  })

  it('getDisplayName should work correctly', () => {
    const { getDisplayName, setDisplayName } = utils
    expect(getDisplayName('abc')).toEqual('abc')
    expect(getDisplayName()).toBeUndefined()
    const test = function () {}
    const ret = setDisplayName('test')(test)
    expect(getDisplayName(ret)).toEqual('test')
  })

  it('wrapDisplayName should work correctly', () => {
    const { wrapDisplayName, setDisplayName } = utils
    const test = function () {}
    const ret = setDisplayName('test')(test)
    const name = wrapDisplayName(ret, 'abc')
    expect(name).toEqual('abc(test)')
  })

  it('promisify should work correctly', async () => {
    const { promisify } = utils
    const test = function () {}
    const ret = promisify(test)
    await ret().then(() => {
      expect(true).toEqual(true)
    })

    const test1 = function () { throw new Error('error') }
    const ret1 = promisify(test1)
    await ret1().catch((e) => {
      expect(e.message).toEqual('error')
    })

    const test2 = function () {
      return Promise.resolve()
    }
    const ret2 = promisify(test2)
    await ret2().then(() => {
      expect(true).toEqual(true)
    })
  })

  it('getUrlParameter should work correctly', () => {
    const { getUrlParameter } = utils
    const url = 'abcd?efg=hijk'
    expect(getUrlParameter(url, 'efg')).toEqual('hijk')
    expect(getUrlParameter(url, 'abc')).toEqual('')
  })
})
