import React, { Suspense } from 'react'
import { Route, HashRouter as Router } from 'react-router-dom'
import RBCore from '../index'
import { mount } from 'enzyme'
import tools from '~/../tests/utils/index'

describe('core/index', () => {
  it('should render correctly', () => {
    const rbInstance = RBCore.create({})
    expect(rbInstance).toMatchSnapshot()
  })

  describe('getContext', () => {
    it('should return correct context', () => {
      const rbInstance = RBCore.create({})
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
      const rbInstance = RBCore.create({})
      const factory = jest.fn(() => {
        return Promise.resolve({
          a: 'test'
        })
      })
      const RB_CONTEXT = {
        options: {
          locale: 'en'
        }
      }

      return rbInstance['loadI18n']('test', factory, RB_CONTEXT).then(i18n => {
        expect(i18n).toEqual({
          a: 'test'
        })
        const context = rbInstance.getContext()
        expect(context.i18ns['test']['en']).toEqual({
          a: 'test'
        })
      })
    })

    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      const factory = jest.fn(() => {
        return Promise.reject(new Error(''))
      })
      const RB_CONTEXT = {
        options: {
          locale: 'en'
        }
      }

      return rbInstance['loadI18n']('test', factory, RB_CONTEXT).then(i18n => {
        expect(i18n).toEqual({})
        const context = rbInstance.getContext()
        expect(context.i18ns['test']['en']).toEqual({})
      })
    })
  })

  describe('loadTheme', () => {
    it('fetch successful', () => {
      const rbInstance = RBCore.create({})
      const factory = jest.fn(() => {
        return Promise.resolve({
          a: 'test'
        })
      })
      const RB_CONTEXT = {
        options: {
          theme: 'default'
        }
      }

      return rbInstance['loadTheme']('test', factory, RB_CONTEXT).then(themeObj => {
        expect(themeObj).toEqual({
          a: 'test'
        })

        const context = rbInstance.getContext()
        expect(context.themes['test']['default']).toEqual({
          a: 'test'
        })
      })
    })
  })

  describe('loadModule', () => {
    it('process successful', () => {
      const rbInstance = RBCore.create({})
      rbInstance['loadI18n'] = jest.fn(() => {
        return Promise.resolve({})
      })
      rbInstance['loadTheme'] = jest.fn(() => {
        return Promise.resolve({})
      })
      rbInstance['packModule'] = jest.fn(() => {
        return Promise.resolve(() => null)
      })
      rbInstance['fetchModule'] = jest.fn(() => {
        return Promise.resolve({
          default: {
            entry: (RB_CONTEXT) => {
              const { options } = RB_CONTEXT
              return function () {
                return <div>{options.locale}</div>
              }
            }
          }
        })
      })
      rbInstance['initInnerModule']({ name: 'test' })

      return rbInstance['loadModule']('testPath', 'test', {}).then(res => {
        expect(typeof res.default).toEqual('function')

        const mockedLoadI18n = rbInstance['loadI18n'] as jest.Mock<Promise<RB.IRBI18nRaw | unknown>, [string, string]>
        const mockedLoadTheme = rbInstance['loadTheme'] as jest.Mock<Promise<RB.IRBThemeRaw | unknown>, [string, string]>
        const mockedPackModule = rbInstance['packModule'] as jest.Mock<Promise<RB.IRBModule>, [string]>
        const mockedFetchModule = rbInstance['fetchModule'] as jest.Mock<Promise<{ default: RB.IRBModuleFactory }>, [string]>
        expect(mockedLoadI18n.mock.calls.length).toBe(1)
        expect(mockedLoadI18n.mock.calls[0][0]).toEqual('test')
        expect(typeof mockedLoadI18n.mock.results[0].value.then).toEqual('function')
        expect(mockedLoadTheme.mock.calls.length).toBe(1)
        expect(mockedLoadTheme.mock.calls[0][0]).toEqual('test')
        expect(typeof mockedLoadTheme.mock.results[0].value.then).toEqual('function')
        expect(mockedPackModule.mock.calls.length).toBe(1)
        expect(mockedPackModule.mock.calls[0][0]).toEqual('test')
        expect(typeof mockedPackModule.mock.results[0].value.then).toEqual('function')
        expect(mockedFetchModule.mock.calls.length).toBe(1)
        expect(mockedFetchModule.mock.calls[0][0]).toEqual('testPath')
        expect(typeof mockedFetchModule.mock.results[0].value.then).toEqual('function')

        const context = rbInstance.getContext()
        expect(typeof context.modules['test']).toEqual('object')
        const testFun: RB.IRBModule = context.modules['test']
        expect(testFun).toMatchSnapshot()
      })
    })
  })

  describe('fetchModule', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      return rbInstance['fetchModule']('testPath').catch(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('packModule', () => {
    it('pack successful', () => {
      interface ITestProps {
        __: (key: string) => string
        theme: RB.IRBTheme
      }
      const Test = ({ __, theme }: ITestProps) => {
        return <div className={theme.test}>{__('test')}</div>
      }

      const rbInstance = RBCore.create({})
      const context = rbInstance.getContext()
      context.modules['test'] = {
        status: 'done',
        value: {
          entry: () => Test as RB.IRBCompModule
        }
      }
      context.i18ns['test'] = {}
      context.i18ns['test']['en'] = {
        test: 'Test'
      }
      context.themes['test'] = {}
      context.themes['test']['default'] = { test: 'test-123' }
      context.modulesConfig['test'] = {
        name: 'test',
        decorators: ['@i18n', '@theme']
      }
      rbInstance.getModule = async (type) => {
        if (type === '@i18n') {
          return (({ i18n }) => WrappedComponent => {
            const i18nDeco = (props) => {
              const __ = (key: string) => {
                return i18n[key]
              }

              return <WrappedComponent {...props} __={__} />
            }

            return i18nDeco
          }) as RB.IRBDecoModule
        } else if (type === '@theme') {
          return (({ theme }) => WrappedComponent => {
            const themeDeco = (props) => {
              return <WrappedComponent {...props} theme={theme} />
            }

            return themeDeco
          }) as RB.IRBDecoModule
        }
      }

      context.i18ns['@i18n'] = {}
      context.i18ns['@theme'] = {}
      context.themes['@i18n'] = {}
      context.themes['@theme'] = {}
      context.modulesConfig['@i18n'] = { name: '@i18n' }
      context.modulesConfig['@theme'] = { name: '@theme' }

      return rbInstance['packModule']('test', Test).then((comp: RB.IRBModule) => {
        const Comp = comp as RB.IRBCompModule
        const wrapper = mount(
          <Comp />
        )
        expect(wrapper.text()).toEqual('Test')
        expect(wrapper.find('.test-123').length).toBe(1)
      })
    })
  })

  describe('getModule', () => {
    it('config not exist', () => {
      const rbInstance = RBCore.create({})
      return rbInstance.getModule('test').then((module) => {
        expect(module).toBe(undefined)
      })
    })

    it('module has been loaded', () => {
      const rbInstance = RBCore.create({})
      const context = rbInstance.getContext()
      context.modulesConfig['test'] = { name: 'test' }
      context.packedModules['test'] = () => { return null }
      return rbInstance.getModule('test').then((module) => {
        expect(typeof module).toEqual('function')
      })
    })

    it('first loaded', () => {
      const rbInstance = RBCore.create({})
      const context = rbInstance.getContext()
      rbInstance['loadModule'] = jest.fn((key, name) => {
        context.packedModules[name] = () => { return null }
        return Promise.resolve({
          default: () => { return null }
        })
      })
      context.modulesConfig['test'] = {
        name: 'test',
        key: 'testPath'
      }
      return rbInstance.getModule('test').then((module) => {
        expect(module).not.toBe(undefined)
        const mockedLoadModule = rbInstance['loadModule'] as jest.Mock<Promise<{ default: RB.IRBModule }>, [string, string]>
        expect(mockedLoadModule.mock.calls.length).toBe(1)
        expect(mockedLoadModule.mock.calls[0][0]).toEqual('testPath')
        expect(mockedLoadModule.mock.calls[0][1]).toEqual('test')
        expect(typeof mockedLoadModule.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('createRoute', () => {
    it('create successful', () => {
      const rbInstance = RBCore.create({})
      const context = rbInstance.getContext()
      const modulesConfig = {
        home: {
          name: 'home',
          route: {
            path: '/',
            exact: true
          }
        },
        notFound: {
          name: 'notFound',
          route: {
            path: undefined
          }
        },
        test: {
          name: 'test',
          route: {
            path: '/test'
          }
        },
        test1: {
          name: 'test1'
        }
      }

      Object.keys(modulesConfig).forEach(key => {
        context.modulesConfig[key] = modulesConfig[key]
      })

      const routes = rbInstance['createRoute']()
      expect(routes).toEqual([{
        name: 'home',
        route: {
          path: '/',
          exact: true
        }
      }, {
        name: 'test',
        route: {
          path: '/test'
        }
      }, {
        name: 'notFound',
        route: {
          path: undefined
        }
      }])
    })
  })

  describe('loadSyncModule', () => {
    it('load successful', () => {
      const rbInstance = RBCore.create({})
      const context = rbInstance.getContext()
      const modulesConfig = {
        test: {
          name: 'test',
          key: 'testPath'
        },
        test1: {
          name: 'test1',
          key: 'test1Path',
          lazy: false
        }
      }

      Object.keys(modulesConfig).forEach(key => {
        context.modulesConfig[key] = modulesConfig[key]
      })

      rbInstance['loadModule'] = jest.fn(() => { return null })
      return rbInstance['loadSyncModule']().then(() => {
        const mockedLoadModule = rbInstance['loadModule'] as jest.Mock<Promise<{ default: RB.IRBModule }>, [string, string]>
        expect(mockedLoadModule.mock.calls.length).toBe(1)
        expect(mockedLoadModule.mock.calls[0][0]).toEqual('test1Path')
        expect(mockedLoadModule.mock.calls[0][1]).toEqual('test1')
      })
    })
  })

  describe('mount', () => {
    beforeEach(() => {
      const div = document.createElement('div')
      div.id = 'container'
      document.body.appendChild(div)
    })
    afterEach(() => {
      const div = document.getElementById('container')
      div.parentNode.removeChild(div)
    })
    it('mount successful', () => {
      const rbInstance = RBCore.create({})
      const Loading = () => {
        return <div className='loading'>loading</div>
      }
      const App = (props) => {
        const { children } = props
        return <div className='app'>{children}</div>
      }
      const Home = () => {
        return <div className='home'>home</div>
      }

      const context = rbInstance.getContext()
      context.packedModules['loading'] = Loading
      context.packedModules['app'] = App
      context.packedModules['home'] = Home
      context.routes.push({
        name: 'home',
        lazy: false,
        route: {
          path: '/'
        }
      })
      rbInstance['loadSyncModule'] = jest.fn(() => {
        return Promise.resolve()
      })
      rbInstance['asyncRoute'] = jest.fn((config) => {
        const { name, route } = config
        const component = context.packedModules['home'] as RB.IRBCompModule
        return <Route key={name} {...route} component={component} />
      })
      return rbInstance.mount().then((Container) => {
        const wrapper = mount(
          <Container />
        )

        const mockedLoadSyncModule = rbInstance['loadSyncModule'] as jest.Mock<Promise<void>, []>
        const mockedAsyncRoute = rbInstance['asyncRoute'] as jest.Mock<React.ReactNode, [RB.IRBConfig]>

        expect(mockedLoadSyncModule.mock.calls.length).toBe(1)
        expect(mockedAsyncRoute.mock.calls.length).toBe(2)
        expect(mockedAsyncRoute.mock.calls[0][0]).toEqual({
          name: 'home',
          lazy: false,
          route: {
            path: '/'
          }
        })
        expect(wrapper.text()).toEqual('home')
        expect(wrapper.find('.home').length).toBe(1)
      })
    })
  })

  describe('asyncRoute', () => {
    it('sync component', () => {
      const rbInstance = RBCore.create({})
      const Home = () => {
        return <div className='home'>home</div>
      }

      const context = rbInstance.getContext()
      context.packedModules['home'] = Home
      const config = {
        key: 'homePath',
        name: 'home',
        lazy: false,
        route: {
          path: '/'
        }
      }
      const RouteComp = rbInstance['asyncRoute'](config)
      const wrapper = mount(
        <Router>
          {
            RouteComp
          }
        </Router>
      )

      expect(wrapper.find('.home').text()).toEqual('home')
    })

    it('async component', async () => {
      const rbInstance = RBCore.create({})
      const config = {
        key: 'homePath',
        name: 'home',
        route: {
          path: '/'
        }
      }

      rbInstance['lazyLoadModule'] = jest.fn(() => {
        return Promise.resolve({
          default: () => { return <div className='home'>home</div> }
        })
      })

      const RouteComp = rbInstance['asyncRoute'](config)
      const Loading = () => {
        return <div className='loading'>loading</div>
      }
      const wrapper = mount(
        <Router>
          <Suspense fallback={<Loading />}>
            {
              RouteComp
            }
          </Suspense>
        </Router>
      )

      expect(wrapper.find('.loading').text()).toEqual('loading')

      return tools.delay(() => {
        wrapper.update()
        const mockedLazyLoadModule = rbInstance['lazyLoadModule'] as jest.Mock<Promise<{ default: React.FC }>, [string, string]>
        expect(mockedLazyLoadModule.mock.calls.length).toBe(1)
        expect(wrapper.find('.home').text()).toEqual('home')
      }, 100)
    })
  })

  describe('check regex', () => {
    it('checkModuleSetEntry', () => {
      const rbInstance = RBCore.create({})

      const checkModuleSetEntry = rbInstance['checkModuleSetEntry']
      expect(checkModuleSetEntry('/modules/common/app/index.entry.ts')).toBe(true)
      expect(checkModuleSetEntry('/modules/common/app/index.entry.tsx')).toBe(true)
      expect(checkModuleSetEntry('/modules/common/+moduleSet/index.entry.ts')).toBe(true)
      expect(checkModuleSetEntry('/modules/common/+moduleSet/index.entry.tsx')).toBe(true)
      expect(checkModuleSetEntry('/modules/common/+moduleSet/modules/loading/index.entry.ts')).toBe(false)
      expect(checkModuleSetEntry('/modules/common/+moduleSet/modules/loading/index.entry.tsx')).toBe(false)
      expect(checkModuleSetEntry('/modules/common/+moduleSet/loading/index.entry.ts')).toBe(false)
      expect(checkModuleSetEntry('/modules/common/+moduleSet/loading/index.entry.tsx')).toBe(false)
    })
  })
})
