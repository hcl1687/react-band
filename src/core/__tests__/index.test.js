import PropTypes from 'prop-types'
import RBCore from '../index'
import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { mount } from 'enzyme'

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

  describe('loadModule', () => {
    it('process successful', () => {
      const rbInstance = RBCore.create()
      rbInstance.loadI18n = jest.fn((path, name) => {
        return Promise.resolve({})
      })
      rbInstance.loadTheme = jest.fn((path, name) => {
        return Promise.resolve({})
      })
      rbInstance.packModule = jest.fn((path, name) => {
        return Promise.resolve({})
      })
      rbInstance.fetchModule = jest.fn((path) => {
        return Promise.resolve({
          'default': (RB_CONTEXT) => {
            const { options } = RB_CONTEXT
            return function () {
              return options.locale
            }
          }
        })
      })

      return rbInstance.loadModule('testPath', 'test').then(res => {
        expect(res).toEqual({
          'default': {}
        })
        expect(rbInstance.loadI18n.mock.calls.length).toBe(1)
        expect(rbInstance.loadI18n.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.loadI18n.mock.calls[0][1]).toEqual('test')
        expect(typeof rbInstance.loadI18n.mock.results[0].value.then).toEqual('function')
        expect(rbInstance.loadTheme.mock.calls.length).toBe(1)
        expect(rbInstance.loadTheme.mock.calls[0][0]).toEqual('testPath')
        expect(rbInstance.loadTheme.mock.calls[0][1]).toEqual('test')
        expect(typeof rbInstance.loadTheme.mock.results[0].value.then).toEqual('function')
        expect(rbInstance.packModule.mock.calls.length).toBe(1)
        expect(rbInstance.packModule.mock.calls[0][0]).toEqual('test')
        expect(typeof rbInstance.packModule.mock.results[0].value.then).toEqual('function')
        expect(rbInstance.fetchModule.mock.calls.length).toBe(1)
        expect(rbInstance.fetchModule.mock.calls[0][0]).toEqual('testPath')
        expect(typeof rbInstance.fetchModule.mock.results[0].value.then).toEqual('function')
        expect(typeof rbInstance._modules['test']).toEqual('function')
        const testFun = rbInstance._modules['test']
        expect(testFun()).toEqual('en')
      })
    })
  })

  describe('fetchModule', () => {
    it('fetch failed', () => {
      const rbInstance = RBCore.create()
      return rbInstance.fetchModule('testPath').catch(() => {
        expect(1).toBe(1)
      })
    })
  })

  describe('packModule', () => {
    it('pack successful', () => {
      class Test extends Component {
        static propTypes = {
          __: PropTypes.func.isRequired,
          theme: PropTypes.object.isRequired
        }
    
        render () {
          const { theme, __ } = this.props
          return <div className={theme.test}>{__('test')}</div>
        }
      }
      const rbInstance = RBCore.create()
      rbInstance._modules['test'] = Test
      rbInstance._i18ns['test'] = {}
      rbInstance._i18ns['test']['en'] = {
        test: 'Test'
      }
      rbInstance._themes['test'] = {}
      rbInstance._themes['test']['default'] = { test: 'test-123' }
      rbInstance._modulesConfig['test'] = {
        name: 'test',
        decorators: ['@i18n', '@theme']
      }
      rbInstance.getModule = (type) => {
        if (type === '@i18n') {
          return ({ i18n }) => WrappedComponent => {
            class i18nDeco extends Component {
              __ = (key, values) => {
                return i18n[key]
              }
        
              render () {
                return <WrappedComponent {...this.props} __={this.__} />
              }
            }
        
            return i18nDeco
          }
        } else if (type === '@theme') {
          return ({ theme }) => WrappedComponent => {
            class themeDeco extends Component {
              render () {
                return <WrappedComponent {...this.props} theme={theme} />
              }
            }
        
            return themeDeco
          }
        }
      }
      rbInstance._i18ns['@i18n'] = {}
      rbInstance._i18ns['@theme'] = {}
      rbInstance._themes['@i18n'] = {}
      rbInstance._themes['@theme'] = {}
      rbInstance._modulesConfig['@i18n'] = {}
      rbInstance._modulesConfig['@theme'] = {}

      return rbInstance.packModule('test').then(Comp => {
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
      const rbInstance = RBCore.create()
      return rbInstance.getModule('test').then((module) => {
        expect(module).toBe(undefined)
      })
    })

    it('module has been loaded', () => {
      const rbInstance = RBCore.create()
      rbInstance._modulesConfig['test'] = {}
      rbInstance._packedModules['test'] = () => {}
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
        'home': {
          name: 'home',
          route: {
            path: '/',
            exact: true
          }
        },
        'notFound': {
          name: 'notFound',
          route: {
            path: undefined
          }
        },
        'test': {
          name: 'test',
          route: {
            path: '/test'
          }
        },
        'test1': {
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
        'test': {
          name: 'test',
          key: 'testPath'
        },
        'test1': {
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
