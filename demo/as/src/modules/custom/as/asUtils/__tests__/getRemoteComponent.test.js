import getRemoteComponent from '../getRemoteComponent'
global.Promise = jest.requireActual('promise')

describe('custom/as/asUtils/getRemoteComponent', () => {
  it('componentInfo is undefined', () => {
    return getRemoteComponent().catch(err => {
      expect(err.message).toBe('getRemoteComponent - Name is required.')
    })
  })

  it('name is required', () => {
    const componentInfo = {}
    return getRemoteComponent(componentInfo).catch(err => {
      expect(err.message).toBe('getRemoteComponent - Name is required.')
    })
  })

  it('libraryName is required', () => {
    const componentInfo = {
      name: 'test'
    }
    return getRemoteComponent(componentInfo).catch(err => {
      expect(err.message).toBe('getRemoteComponent - libraryName is required.')
    })
  })

  it('path is required', () => {
    const componentInfo = {
      name: 'test',
      libraryName: 'Test'
    }
    return getRemoteComponent(componentInfo).catch(err => {
      expect(err.message).toBe('getRemoteComponent - path is required.')
    })
  })

  it('path is required', () => {
    const componentInfo = {
      name: 'test',
      libraryName: 'Test'
    }
    return getRemoteComponent(componentInfo).catch(err => {
      expect(err.message).toBe('getRemoteComponent - path is required.')
    })
  })

  it('entries is required', () => {
    const componentInfo = {
      name: 'test',
      libraryName: 'Test',
      path: '/test',
      entries: []
    }
    return getRemoteComponent(componentInfo).catch(err => {
      expect(err.message).toBe('getRemoteComponent - entries is required.')
    })
  })

  it('entries is object', () => {
    const componentInfo = {
      name: 'test',
      libraryName: 'Test',
      path: '/test',
      entries: {}
    }
    return getRemoteComponent(componentInfo).catch(err => {
      expect(err.message).toBe('getRemoteComponent - entries is required.')
    })
  })

  it('check dependencies', () => {
    const componentInfo = {
      name: 'test',
      libraryName: 'Test',
      path: 'www.hcl1687.com/test',
      entries: ['index.js', 'index.css'],
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React'
        }
      }
    }
    return getRemoteComponent(componentInfo).catch(err => {
      expect(err.message).toBe('getRemoteComponent - Need dependencies: react.')
    })
  })

  it('should fecth remote lib correctly.', () => {
    const componentInfo = {
      name: 'test',
      libraryName: 'Test',
      path: './',
      entries: ['testLib.js', 'testLib.css'],
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React'
        }
      }
    }
    const dependencies = {
      react: { version: '16.8.6' }
    }

    const oldCreateScript = getRemoteComponent.createScript
    getRemoteComponent.createScript = jest.fn(({ id, src, onload, onerror }) => {
      const scriptDom = oldCreateScript({ id, src, onload, onerror })
      expect(src).toBe('./testLib.js')
      setTimeout(() => {
        window.Test = {
          name: 'Test',
          version: '0.1.0'
        }
        scriptDom.onload()
      }, 1000)
    })

    return getRemoteComponent(componentInfo, dependencies).then((Test) => {
      expect(Test.name).toBe('Test')
      expect(Test.version).toBe('0.1.0')
      expect(getRemoteComponent.createScript).toHaveBeenCalled()
      getRemoteComponent.createScript = oldCreateScript
    })
  })

  it('componnet has loaded.', () => {
    const componentInfo = {
      name: 'test0',
      libraryName: 'Test0',
      path: './',
      entries: ['test0Lib.js', 'test0Lib.css'],
      version: '0.1.0',
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React'
        }
      }
    }
    const dependencies = {
      react: { version: '16.8.6' }
    }

    const oldCreateScript = getRemoteComponent.createScript
    getRemoteComponent.createScript = jest.fn(({ id, src, onload, onerror }) => {
      const scriptDom = oldCreateScript({ id, src, onload, onerror })
      expect(src).toBe('./test0Lib.js?v=0.1.0')
      setTimeout(() => {
        window.Test0 = {
          name: 'Test0',
          version: '0.1.0'
        }
        scriptDom.onload()
      }, 1000)
    })

    return getRemoteComponent(componentInfo, dependencies).then(() => {
      return getRemoteComponent(componentInfo, dependencies).then((Test0) => {
        expect(Test0.name).toBe('Test0')
        expect(Test0.version).toBe('0.1.0')
        expect(getRemoteComponent.createScript.mock.calls.length).toBe(1)
        getRemoteComponent.createScript = oldCreateScript
      })
    })
  })

  it('componnet is loading.', () => {
    const componentInfo = {
      name: 'test1',
      libraryName: 'Test1',
      path: './',
      entries: ['test1Lib.js', 'test1Lib.css'],
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React'
        }
      }
    }
    const dependencies = {
      react: { version: '16.8.6' }
    }

    const oldCreateScript = getRemoteComponent.createScript
    getRemoteComponent.createScript = jest.fn(({ id, src, onload, onerror }) => {
      const scriptDom = oldCreateScript({ id, src, onload, onerror })
      expect(src).toBe('./test1Lib.js')
      setTimeout(() => {
        window.Test1 = {
          name: 'Test1',
          version: '0.1.0'
        }
        scriptDom.onload()
      }, 1000)
    })

    getRemoteComponent(componentInfo, dependencies).then((Test1) => {
      expect(Test1.name).toBe('Test1')
      expect(Test1.version).toBe('0.1.0')
      expect(getRemoteComponent.createScript.mock.calls.length).toBe(1)
    })
    return getRemoteComponent(componentInfo, dependencies).then((Test1) => {
      expect(Test1.name).toBe('Test1')
      expect(Test1.version).toBe('0.1.0')
      expect(getRemoteComponent.createScript.mock.calls.length).toBe(1)
      getRemoteComponent.createScript = oldCreateScript
    })
  })

  it('load component failed.', () => {
    const componentInfo = {
      name: 'test2',
      libraryName: 'Test2',
      path: './',
      entries: ['test2Lib.js', 'test2Lib.css'],
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React'
        }
      }
    }
    const dependencies = {
      react: { version: '16.8.6' }
    }

    const oldCreateScript = getRemoteComponent.createScript
    getRemoteComponent.createScript = jest.fn(({ id, src, onload, onerror }) => {
      const scriptDom = oldCreateScript({ id, src, onload, onerror })
      expect(src).toBe('./test2Lib.js')
      setTimeout(() => {
        window.Test = {
          name: 'Test2',
          version: '0.1.0'
        }
        scriptDom.onerror()
      }, 1000)
    })

    return getRemoteComponent(componentInfo, dependencies).catch((err) => {
      expect(err.message.indexOf('load failed') > -1).toBe(true)
      getRemoteComponent.createScript = oldCreateScript
    })
  })

  it('componnet is loading, load component failed.', () => {
    const componentInfo = {
      name: 'test3',
      libraryName: 'Test3',
      path: './',
      entries: ['test3Lib.js', 'test3Lib.css'],
      externals: {
        react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React'
        }
      }
    }
    const dependencies = {
      react: { version: '16.8.6' }
    }

    const oldCreateScript = getRemoteComponent.createScript
    getRemoteComponent.createScript = jest.fn(({ id, src, onload, onerror }) => {
      const scriptDom = oldCreateScript({ id, src, onload, onerror })
      expect(src).toBe('./test3Lib.js')
      setTimeout(() => {
        window.Test = {
          name: 'Test2',
          version: '0.1.0'
        }
        scriptDom.onerror()
      }, 1000)
    })

    getRemoteComponent(componentInfo, dependencies).catch((err) => {
      expect(err.message.indexOf('load failed') > -1).toBe(true)
    })
    return getRemoteComponent(componentInfo, dependencies).catch((err) => {
      expect(getRemoteComponent.createScript.mock.calls.length).toBe(1)
      expect(err.message.indexOf('load failed') > -1).toBe(true)
      getRemoteComponent.createScript = oldCreateScript
    })
  })
})
