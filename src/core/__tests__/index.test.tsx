import { IRBCompModule, IRBConfig, IRBConfigMap, IRBContext, IRBCore, IRBDecoConfig, IRBDecoModule, IRBI18n, IRBI18nRaw,
  IRBI18nsMap, IRBModule, IRBModuleFactory, IRBModulesMap, IRBOptions, IRBTheme, IRBThemeRaw, IRBThemesMap } from '../interface'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import RBCore from '../index'
import { Route } from 'react-router-dom'
import { mount } from 'enzyme'

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
      rbInstance.fetchI18n = jest.fn((path, locale) => {
        return Promise.resolve({
          default: {
            a: 'test'
          }
        })
      })

      return rbInstance.loadI18n('testPath', 'test').then(i18n => {
        expect(i18n).toEqual({
          default: {
            a: 'test'
          }
        })
        const context = rbInstance.getContext()
        expect(context.i18ns['test']['en']).toEqual({
          a: 'test'
        })

        const mockedFetchI18n = rbInstance.fetchI18n as jest.Mock<Promise<IRBI18nRaw>, [string, string]>
        expect(mockedFetchI18n.mock.calls.length).toBe(1)
        expect(mockedFetchI18n.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchI18n.mock.calls[0][1]).toEqual('en')
        expect(typeof mockedFetchI18n.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      rbInstance.fetchI18n = jest.fn((path, locale) => {
        return Promise.reject(new Error(''))
      })

      return rbInstance.loadI18n('testPath', 'test').then(i18n => {
        expect(i18n).toEqual({})
        const context = rbInstance.getContext()
        expect(context.i18ns['test']['en']).toEqual({})
        const mockedFetchI18n = rbInstance.fetchI18n as jest.Mock<Promise<IRBI18nRaw>, [string, string]>
        expect(mockedFetchI18n.mock.calls.length).toBe(1)
        expect(mockedFetchI18n.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchI18n.mock.calls[0][1]).toEqual('en')
        expect(typeof mockedFetchI18n.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchI18n', () => {
    it('fetch json successful', () => {
      const rbInstance = RBCore.create({})
      rbInstance.fetchI18nJSON = jest.fn((path, locale) => {
        return Promise.resolve({
          default: {
            a: 'test'
          }
        })
      })
      return rbInstance.fetchI18n('testPath', 'en').then((i18n) => {
        expect(i18n).toEqual({
          default: {
            a: 'test'
          }
        })

        const mockedFetchI18nJSON = rbInstance.fetchI18nJSON as jest.Mock<Promise<IRBI18nRaw>, [string, string]>
        expect(mockedFetchI18nJSON.mock.calls.length).toBe(1)
        expect(mockedFetchI18nJSON.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchI18nJSON.mock.calls[0][1]).toEqual('en')
        expect(typeof mockedFetchI18nJSON.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch json failed', () => {
      const rbInstance = RBCore.create({})
      rbInstance.fetchI18nJSON = jest.fn((path, locale) => {
        return Promise.reject(new Error(''))
      })
      rbInstance.fetchI18nJS = jest.fn((path, locale) => {
        return Promise.resolve({
          default: {
            a: 'test'
          }
        })
      })
      return rbInstance.fetchI18n('testPath', 'en').then((i18n) => {
        expect(i18n).toEqual({
          default: {
            a: 'test'
          }
        })

        const mockedFetchI18nJSON = rbInstance.fetchI18nJSON as jest.Mock<Promise<IRBI18nRaw>, [string, string]>
        const mockedFetchI18nJS = rbInstance.fetchI18nJS as jest.Mock<Promise<IRBI18nRaw>, [string, string]>

        expect(mockedFetchI18nJSON.mock.calls.length).toBe(1)
        expect(mockedFetchI18nJSON.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchI18nJSON.mock.calls[0][1]).toEqual('en')
        expect(typeof mockedFetchI18nJSON.mock.results[0].value.then).toEqual('function')
        expect(mockedFetchI18nJS.mock.calls.length).toBe(1)
        expect(mockedFetchI18nJS.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchI18nJS.mock.calls[0][1]).toEqual('en')
        expect(typeof mockedFetchI18nJS.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      rbInstance.fetchI18nJSON = jest.fn((path, locale) => {
        return Promise.reject(new Error(''))
      })
      rbInstance.fetchI18nJS = jest.fn((path, locale) => {
        return Promise.reject(new Error(''))
      })
      return rbInstance.fetchI18n('testPath', 'en').catch(() => {
        const mockedFetchI18nJSON = rbInstance.fetchI18nJSON as jest.Mock<Promise<IRBI18nRaw>, [string, string]>
        const mockedFetchI18nJS = rbInstance.fetchI18nJS as jest.Mock<Promise<IRBI18nRaw>, [string, string]>

        expect(mockedFetchI18nJSON.mock.calls.length).toBe(1)
        expect(mockedFetchI18nJSON.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchI18nJSON.mock.calls[0][1]).toEqual('en')
        expect(typeof mockedFetchI18nJSON.mock.results[0].value.then).toEqual('function')
        expect(mockedFetchI18nJS.mock.calls.length).toBe(1)
        expect(mockedFetchI18nJS.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchI18nJS.mock.calls[0][1]).toEqual('en')
        expect(typeof mockedFetchI18nJS.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchI18nJSON', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      return rbInstance.fetchI18nJSON('testPath', 'en').catch(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('fetchI18nJS', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      return rbInstance.fetchI18nJS('testPath', 'en').catch(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('loadTheme', () => {
    it('fetch successful', () => {
      const rbInstance = RBCore.create({})
      rbInstance.fetchTheme = jest.fn((path, locale) => {
        return Promise.resolve({
          default: {
            a: 'test'
          }
        })
      })

      return rbInstance.loadTheme('testPath', 'test').then(i18n => {
        expect(i18n).toEqual({
          default: {
            a: 'test'
          }
        })

        const context = rbInstance.getContext()
        expect(context.themes['test']['default']).toEqual({
          a: 'test'
        })

        const mockedFetchTheme = rbInstance.fetchTheme as jest.Mock<Promise<IRBThemeRaw>, [string, string]>
        expect(mockedFetchTheme.mock.calls.length).toBe(1)
        expect(mockedFetchTheme.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof mockedFetchTheme.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchTheme', () => {
    it('fetch local successful', () => {
      const rbInstance = RBCore.create({})
      rbInstance.fetchLocalTheme = jest.fn((path, locale) => {
        return Promise.resolve({
          default: {
            a: 'test'
          }
        })
      })
      return rbInstance.fetchTheme('testPath', 'default').then((i18n) => {
        expect(i18n).toEqual({
          default: {
            a: 'test'
          }
        })

        const mockedFetchLocalTheme = rbInstance.fetchLocalTheme as jest.Mock<Promise<IRBThemeRaw>, [string, string]>
        expect(mockedFetchLocalTheme.mock.calls.length).toBe(1)
        expect(mockedFetchLocalTheme.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchLocalTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof mockedFetchLocalTheme.mock.results[0].value.then).toEqual('function')
      })
    })

    it('fetch local and global successful', () => {
      const rbInstance = RBCore.create({})
      rbInstance.fetchLocalTheme = jest.fn((path, locale) => {
        return Promise.resolve({
          default: {
            a: 'test'
          }
        })
      })
      rbInstance.fetchGlobalTheme = jest.fn((path, locale) => {
        return Promise.resolve({})
      })
      return rbInstance.fetchTheme('testPath', 'default').then((i18n) => {
        expect(i18n).toEqual({
          default: {
            a: 'test'
          }
        })

        const mockedFetchLocalTheme = rbInstance.fetchLocalTheme as jest.Mock<Promise<IRBThemeRaw>, [string, string]>
        const mockedFetchGlobalTheme = rbInstance.fetchGlobalTheme as jest.Mock<Promise<unknown>, [string, string]>
        expect(mockedFetchLocalTheme.mock.calls.length).toBe(1)
        expect(mockedFetchLocalTheme.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchLocalTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof mockedFetchLocalTheme.mock.results[0].value.then).toEqual('function')
        expect(mockedFetchGlobalTheme.mock.calls.length).toBe(1)
        expect(mockedFetchGlobalTheme.mock.calls[0][0]).toEqual('testPath')
        expect(mockedFetchGlobalTheme.mock.calls[0][1]).toEqual('default')
        expect(typeof mockedFetchGlobalTheme.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('fetchLocalTheme', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      return rbInstance.fetchLocalTheme('testPath', 'default').then((res) => {
        expect(res).toEqual({
          default: {}
        })
      })
    })
  })

  describe('fetchGlobalTheme', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      return rbInstance.fetchGlobalTheme('testPath', 'default').then(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('loadModule', () => {
    it('process successful', () => {
      const rbInstance = RBCore.create({})
      rbInstance.loadI18n = jest.fn((path, name) => {
        return Promise.resolve({})
      })
      rbInstance.loadTheme = jest.fn((path, name) => {
        return Promise.resolve({})
      })
      rbInstance.packModule = jest.fn((name) => {
        return Promise.resolve(() => null)
      })
      rbInstance.fetchModule = jest.fn((path) => {
        return Promise.resolve({
          default: (RB_CONTEXT) => {
            const { options } = RB_CONTEXT
            return function () {
              return <div>{options.locale}</div>
            }
          }
        })
      })

      return rbInstance.loadModule('testPath', 'test').then(res => {
        expect(res).toEqual({
          default: {}
        })

        const mockedLoadI18n = rbInstance.loadI18n as jest.Mock<Promise<IRBI18nRaw | unknown>, [string, string]>
        const mockedLoadTheme = rbInstance.loadTheme as jest.Mock<Promise<IRBThemeRaw | unknown>, [string, string]>
        const mockedPackModule = rbInstance.packModule as jest.Mock<Promise<IRBModule>, [string]>
        const mockedFetchModule = rbInstance.fetchModule as jest.Mock<Promise<{ default: IRBModuleFactory }>, [string]>
        expect(mockedLoadI18n.mock.calls.length).toBe(1)
        expect(mockedLoadI18n.mock.calls[0][0]).toEqual('testPath')
        expect(mockedLoadI18n.mock.calls[0][1]).toEqual('test')
        expect(typeof mockedLoadI18n.mock.results[0].value.then).toEqual('function')
        expect(mockedLoadTheme.mock.calls.length).toBe(1)
        expect(mockedLoadTheme.mock.calls[0][0]).toEqual('testPath')
        expect(mockedLoadTheme.mock.calls[0][1]).toEqual('test')
        expect(typeof mockedLoadTheme.mock.results[0].value.then).toEqual('function')
        expect(mockedPackModule.mock.calls.length).toBe(1)
        expect(mockedPackModule.mock.calls[0][0]).toEqual('test')
        expect(typeof mockedPackModule.mock.results[0].value.then).toEqual('function')
        expect(mockedFetchModule.mock.calls.length).toBe(1)
        expect(mockedFetchModule.mock.calls[0][0]).toEqual('testPath')
        expect(typeof mockedFetchModule.mock.results[0].value.then).toEqual('function')

        const context = rbInstance.getContext()
        expect(typeof context.modules['test']).toEqual('function')
        const testFun: IRBModule = context.modules['test']
        expect(testFun).toMatchSnapshot()
      })
    })
  })

  describe('fetchModule', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create({})
      return rbInstance.fetchModule('testPath').catch(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('packModule', () => {
    it('pack successful', () => {
      interface ITestProps {
        __: (key: string) => string
        theme: IRBTheme
      }
      const Test = ({ __, theme }: ITestProps) => {
        return <div className={theme.test}>{__('test')}</div>
      }

      const rbInstance = RBCore.create({})
      const context = rbInstance.getContext()
      context.modules['test'] = Test as IRBCompModule
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
              const __ = (key: string, values: Array<any>) => {
                return i18n[key]
              }

              return <WrappedComponent {...props} __={__} />
            }

            return i18nDeco
          }) as IRBDecoModule
        } else if (type === '@theme') {
          return (({ theme }) => WrappedComponent => {
            const themeDeco = (props) => {
              return <WrappedComponent {...props} theme={theme} />
            }

            return themeDeco
          }) as IRBDecoModule
        }
      }

      context.i18ns['@i18n'] = {}
      context.i18ns['@theme'] = {}
      context.themes['@i18n'] = {}
      context.themes['@theme'] = {}
      context.modulesConfig['@i18n'] = { name: '@i18n' }
      context.modulesConfig['@theme'] = { name: '@theme' }

      return rbInstance.packModule('test').then((comp: IRBModule) => {
        const Comp = comp as IRBCompModule
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
      context.packedModules['test'] = () => {}
      return rbInstance.getModule('test').then((module) => {
        expect(typeof module).toEqual('function')
      })
    })

    it('first loaded', () => {
      const rbInstance = RBCore.create()
      rbInstance.loadModule = jest.fn((key, name) => {
        rbInstance._packedModules[name] = () => {}
        return Promise.resolve({})
      })
      rbInstance._modulesConfig['test'] = {
        key: 'testPath'
      }
      return rbInstance.getModule('test').then((module) => {
        expect(module).not.toBe(undefined)
        expect(rbInstance.loadModule.mock.calls.length).toBe(1)
        expect(rbInstance.loadModule.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.loadModule.mock.calls[0][1]).toEqual('test')
        expect(typeof rbInstance.loadModule.mock.results[0].value.then).toEqual('function')
      })
    })
  })

  describe('createRoute', () => {
    it('create successful', () => {
      const rbInstance = RBCore.create()
      rbInstance._modulesConfig = {
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
      const routes = rbInstance.createRoute()
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
      const rbInstance = RBCore.create()
      rbInstance._modulesConfig = {
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
      rbInstance.loadModule = jest.fn((key, name) => {})
      return rbInstance.loadSyncModule().then(() => {
        expect(rbInstance.loadModule.mock.calls.length).toBe(1)
        expect(rbInstance.loadModule.mock.calls[0][0]).toEqual('test1Path')
        expect(rbInstance.loadModule.mock.calls[0][1]).toEqual('test1')
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
      const rbInstance = RBCore.create()
      class Loading extends Component {
        render () {
          return <div className='loading'>loading</div>
        }
      }
      class App extends Component {
        static propTypes = {
          children: PropTypes.any
        }

        render () {
          const { children } = this.props
          return <div className='app'>{children}</div>
        }
      }
      class Home extends Component {
        render () {
          return <div className='home'>home</div>
        }
      }
      rbInstance._packedModules['loading'] = Loading
      rbInstance._packedModules['app'] = App
      rbInstance._packedModules['home'] = Home
      rbInstance._routes = [{
        name: 'home',
        lazy: false,
        route: {
          path: '/'
        }
      }]
      rbInstance.loadSyncModule = jest.fn((key, name) => {
        return Promise.resolve({})
      })
      rbInstance.asyncRoute = jest.fn((config) => {
        const { name, route } = config
        const component = rbInstance._packedModules['home']
        return <Route key={name} {...route} component={component} />
      })
      return rbInstance.mount().then((Container) => {
        const wrapper = mount(
          <Container />
        )

        expect(rbInstance.loadSyncModule.mock.calls.length).toBe(1)
        expect(rbInstance.asyncRoute.mock.calls.length).toBe(2)
        expect(rbInstance.asyncRoute.mock.calls[0][0]).toEqual({
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
      const rbInstance = RBCore.create()
      class Home extends Component {
        render () {
          return <div className='home'>home</div>
        }
      }
      rbInstance._packedModules['home'] = Home
      const config = {
        key: 'homePath',
        name: 'home',
        lazy: false,
        route: {
          path: '/'
        }
      }
      const route = rbInstance.asyncRoute(config)
      expect(route.key).toEqual('home')
      expect(route.props.path).toEqual('/')
      expect(typeof route.props.component).toEqual('function')
    })

    it('async component', () => {
      const rbInstance = RBCore.create()
      const config = {
        key: 'homePath',
        name: 'home',
        route: {
          path: '/'
        }
      }
      const route = rbInstance.asyncRoute(config)
      expect(route.key).toEqual('home')
      expect(route.props.path).toEqual('/')
    })
  })
})
