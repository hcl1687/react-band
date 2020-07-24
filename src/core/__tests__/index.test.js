import RBCore from '../index'

describe('core/index', () => {
  it('should render correctly', () => {
    const rbInstance = RBCore.create({})
    expect(rbInstance).toMatchSnapshot()
  })

  describe('getContext', () => {
    it('should return correct context', () => {
      const rbInstance = RBCore.create()
      const context = rbInstance.getContext()
      expect(context.options).toEqual({
        locale: 'en',
        theme: 'default',
        container: '#container'
      })
      expect(context.modules).toEqual({})
      expect(context.i18ns).toEqual({})
      expect(context.themes).toEqual({})
      expect(context.packedModules).toEqual({})
      expect(context.modulesConfig).toEqual({})
      expect(context.routes).toEqual([])
      expect(context.getModule).toEqual(rbInstance.getModule)
    })
  })

  describe('loadI18n', () => {
    it('fetch successful', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchI18n = jest.fn((path, locale) => {
        return Promise.resolve({
          'default': {
            a: 'test'
          }
        })
      })

      return rbInstance.loadI18n('testPath', 'test').then(i18n => {
        expect(i18n).toEqual({
          'default': {
            a: 'test'
          }
        })
        expect(rbInstance._i18ns['test']['en']).toEqual({
          a: 'test'
        })
        expect(rbInstance.fetchI18n.mock.calls.length).toBe(1)
        expect(rbInstance.fetchI18n.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchI18n.mock.calls[0][1]).toEqual('en')
        expect(typeof rbInstance.fetchI18n.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch failed', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchI18n = jest.fn((path, locale) => {
        return Promise.reject({})
      })

      return rbInstance.loadI18n('testPath', 'test').then(i18n => {
        expect(i18n).toEqual({})
        expect(rbInstance._i18ns['test']['en']).toEqual({})
        expect(rbInstance.fetchI18n.mock.calls.length).toBe(1)
        expect(rbInstance.fetchI18n.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchI18n.mock.calls[0][1]).toEqual('en')
        expect(typeof rbInstance.fetchI18n.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchI18n', () => {
    it('fetch json successful', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchI18nJSON = jest.fn((path, locale) => {
        return Promise.resolve({
          'default': {
            a: 'test'
          }
        })
      })
      return rbInstance.fetchI18n('testPath', 'en').then((i18n) => {
        expect(i18n).toEqual({
          'default': {
            a: 'test'
          }
        })
        expect(rbInstance.fetchI18nJSON.mock.calls.length).toBe(1)
        expect(rbInstance.fetchI18nJSON.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchI18nJSON.mock.calls[0][1]).toEqual('en')
        expect(typeof rbInstance.fetchI18nJSON.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch json failed', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchI18nJSON = jest.fn((path, locale) => {
        return Promise.reject({})
      })
      rbInstance.fetchI18nJS = jest.fn((path, locale) => {
        return Promise.resolve({
          'default': {
            a: 'test'
          }
        })
      })
      return rbInstance.fetchI18n('testPath', 'en').then((i18n) => {
        expect(i18n).toEqual({
          'default': {
            a: 'test'
          }
        })
        expect(rbInstance.fetchI18nJSON.mock.calls.length).toBe(1)
        expect(rbInstance.fetchI18nJSON.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchI18nJSON.mock.calls[0][1]).toEqual('en')
        expect(typeof rbInstance.fetchI18nJSON.mock.results[0].value.then).toEqual('function')
        expect(rbInstance.fetchI18nJS.mock.calls.length).toBe(1)
        expect(rbInstance.fetchI18nJS.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchI18nJS.mock.calls[0][1]).toEqual('en')
        expect(typeof rbInstance.fetchI18nJS.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch failed', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchI18nJSON = jest.fn((path, locale) => {
        return Promise.reject({})
      })
      rbInstance.fetchI18nJS = jest.fn((path, locale) => {
        return Promise.reject({})
      })
      return rbInstance.fetchI18n('testPath', 'en').catch(() => {
        expect(rbInstance.fetchI18nJSON.mock.calls.length).toBe(1)
        expect(rbInstance.fetchI18nJSON.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchI18nJSON.mock.calls[0][1]).toEqual('en')
        expect(typeof rbInstance.fetchI18nJSON.mock.results[0].value.then).toEqual('function')
        expect(rbInstance.fetchI18nJS.mock.calls.length).toBe(1)
        expect(rbInstance.fetchI18nJS.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchI18nJS.mock.calls[0][1]).toEqual('en')
        expect(typeof rbInstance.fetchI18nJS.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchI18nJSON', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create()
      return rbInstance.fetchI18nJSON('testPath', 'en').catch(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('fetchI18nJS', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create()
      return rbInstance.fetchI18nJS('testPath', 'en').catch(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('loadTheme', () => {
    it('fetch successful', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchTheme = jest.fn((path, locale) => {
        return Promise.resolve({
          'default': {
            a: 'test'
          }
        })
      })

      return rbInstance.loadTheme('testPath', 'test').then(i18n => {
        expect(i18n).toEqual({
          'default': {
            a: 'test'
          }
        })
        expect(rbInstance._themes['test']['default']).toEqual({
          a: 'test'
        })
        expect(rbInstance.fetchTheme.mock.calls.length).toBe(1)
        expect(rbInstance.fetchTheme.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof rbInstance.fetchTheme.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchTheme', () => {
    it('fetch local successful', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchLocalTheme = jest.fn((path, locale) => {
        return Promise.resolve({
          'default': {
            a: 'test'
          }
        })
      })
      return rbInstance.fetchTheme('testPath', 'default').then((i18n) => {
        expect(i18n).toEqual({
          'default': {
            a: 'test'
          }
        })
        expect(rbInstance.fetchLocalTheme.mock.calls.length).toBe(1)
        expect(rbInstance.fetchLocalTheme.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchLocalTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof rbInstance.fetchLocalTheme.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch local and global successful', () => {
      const rbInstance = RBCore.create()
      rbInstance.fetchLocalTheme = jest.fn((path, locale) => {
        return Promise.resolve({
          'default': {
            a: 'test'
          }
        })
      })
      rbInstance.fetchGlobalTheme = jest.fn((path, locale) => {
        return Promise.resolve({})
      })
      return rbInstance.fetchTheme('testPath', 'default').then((i18n) => {
        expect(i18n).toEqual({
          'default': {
            a: 'test'
          }
        })
        expect(rbInstance.fetchLocalTheme.mock.calls.length).toBe(1)
        expect(rbInstance.fetchLocalTheme.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchLocalTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof rbInstance.fetchLocalTheme.mock.results[0].value.then).toEqual('function')
        expect(rbInstance.fetchGlobalTheme.mock.calls.length).toBe(1)
        expect(rbInstance.fetchGlobalTheme.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.fetchGlobalTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof rbInstance.fetchGlobalTheme.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchLocalTheme', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create()
      return rbInstance.fetchLocalTheme('testPath', 'default').then((res) => {
        expect(res).toEqual({
          'default': {}
        })
      })
    })
  })

  describe('fetchGlobalTheme', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create()
      return rbInstance.fetchGlobalTheme('testPath', 'default').then(() => {
        expect(1).toBe(1)
      })
    })
  })
})
