import React, { Suspense } from 'react'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import flowFactory from 'promiseflow'
import getConfig from './getConfig'

const runFlow = flowFactory(Promise)
const DEFAULT_OPTIONS = {
  locale: 'en',
  theme: 'default',
  container: '#container'
}

export default class RBCore {
  constructor (options = {}) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options)
    this._modules = {}
    this._i18ns = {}
    this._themes = {}
    this._packedModules = {}
    this._modulesConfig = getConfig(this._options)
    this._routes = this.createRoute()
  }

  static create (options) {
    return new RBCore(options)
  }

  getContext () {
    return {
      options: this._options,
      modules: this._modules,
      i18ns: this._i18ns,
      themes: this._themes,
      packedModules: this._packedModules,
      modulesConfig: this._modulesConfig,
      routes: this._routes,
      getModule: this.getModule
    }
  }

  async loadI18n (name, factory, RB_CONTEXT) {
    const { locale } = RB_CONTEXT.options
    try {
      let i18n = await factory(RB_CONTEXT)
      i18n = i18n || {}
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = i18n
      return i18n
    } catch {
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = {}
      return {}
    }
  }

  async loadTheme (name, factory, RB_CONTEXT) {
    const { theme } = RB_CONTEXT.options
    try {
      let themeObj = await factory(RB_CONTEXT)
      themeObj = themeObj || {}
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = themeObj
      return themeObj
    } catch {
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = {}
      return {}
    }
  }

  async fetchModule (path) {
    path = path.replace(/^\.\//, '')
    return import(
      /* webpackExclude: /[/\\]\+[^+/\\]+[/\\][^+/\\]+[/\\]/ */
      /* webpackInclude: /index\.entry\.(js|jsx)$/ */
      `~/modules/${path}/index.entry`
    )
  }

  checkModuleSetEntry (path) {
    // +moduleSet/index.entry.jsx will be bunndled
    // +moduleSet/xxx/index.entry.jsx will be skipped.
    const excludeRegex = /[/\\]\+[^+/\\]+[/\\][^+/\\]+[/\\]/
    const includeRegex = /index\.entry\.(js|jsx)$/

    if (!excludeRegex.test(path)) {
      if (includeRegex.test(path)) {
        return true
      }
    }

    return false
  }

  async loadModule (path, name, config) {
    const ret = {
      default: null
    }

    try {
      let module
      if (config.set) {
        // if the target module is in a module set.
        // load the module set instead.
        const setName = config.set
        await this.getModule(setName)

        const setModule = this._packedModules[setName]
        module = setModule[name]
      } else {
        // load module
        const res = await this.fetchModule(path)
        module = res['default']
      }

      this._modules[name].value = module

      const entryFactory = module.entry
      const i18nFactory = module.i18n
      const themeFactory = module.theme

      const RB_CONTEXT = this.getContext()
      // load entry
      const entryPromise = entryFactory(RB_CONTEXT)
      // load i18n
      const i18nPromise = this.loadI18n(name, i18nFactory, RB_CONTEXT)
      // load theme
      const themePromise = this.loadTheme(name, themeFactory, RB_CONTEXT)
      const res = await Promise.all([entryPromise, i18nPromise, themePromise])
      const entry = res[0]

      ret['default'] = await this.packModule(name, entry)
      this._modules[name].trigger[0]()
    } catch (err) {
      this._modules[name].trigger[1](err)
      throw err
    }

    return ret
  }

  async packModule (name, module) {
    const { locale, theme } = this._options
    const i18n = this._i18ns[name][locale]
    const themeObj = this._themes[name][theme]
    const RB_CONTEXT = this.getContext()

    const config = this._modulesConfig[name]
    if (config.type !== 'decorator' && config.type !== 'set') {
      // it's component type
      // get decorators from config
      const { decorators = [] } = config
      for (let i = 0; i < decorators.length; i++) {
        const deco = decorators[i]
        const decoModule = await this.getModule(deco)
        const decoConfig = this._modulesConfig[deco]
        const decoI18n = this._i18ns[deco][locale]
        const decoThemeObj = this._themes[deco][theme]
        if (decoModule) {
          module = await decoModule({
            ...config,
            i18n,
            theme: themeObj
          }, {
            ...decoConfig,
            i18n: decoI18n,
            theme: decoThemeObj
          }, RB_CONTEXT)(module)
        }
      }
    }

    this._packedModules[name] = module

    return module
  }

  getModule = async (name, wrapped = false) => {
    const _getModule = async () => {
      const config = this._modulesConfig[name]
      if (!config) {
        return
      }

      if (this._packedModules[name]) {
        return this._packedModules[name]
      } else {
        if (this._modules[name] && this._modules[name].waittingPromise) {
          await this._modules[name].waittingPromise
          return this._packedModules[name]
        } else {
          this.initInnerModule({ name })
        }
      }

      await this.loadModule(config.key, name, config)
      return this._packedModules[name]
    }

    const m = await _getModule()

    return wrapped ? {
      default: m
    } : m
  }

  initInnerModule ({ name, status = 'pending', value = null } = {}) {
    const ret = {
      status,
      value
    }
    let trigger
    const waittingPromise = new Promise((resolve, reject) => {
      trigger = [resolve, reject]
    }).then((res) => {
      this._modules[name]['status'] = 'done'
      delete ret.trigger
      delete ret.waittingPromise
      return res
    }).catch(err => {
      this._modules[name]['status'] = 'failed'
      delete ret.trigger
      delete ret.waittingPromise
      throw err
    })

    ret.trigger = trigger
    ret.waittingPromise = waittingPromise

    this._modules[name] = ret

    return ret
  }

  createRoute () {
    const modulesConfig = this._modulesConfig
    let homeConfig
    let notFoundConfig
    Object.keys(modulesConfig).forEach(name => {
      const config = modulesConfig[name]
      const { route } = config
      if (route && route.path === '/') {
        homeConfig = config
      } else if (route && route.path === undefined) {
        notFoundConfig = config
      }
    })

    const routes = Object.keys(modulesConfig).map(name => modulesConfig[name]).filter(config => {
      if (!config.route) {
        return false
      }

      if (config.route && config.route.path === '/') {
        return false
      }

      if (config.route && config.route.path === undefined) {
        return false
      }

      return true
    })

    if (homeConfig) {
      routes.unshift(homeConfig)
    }
    if (notFoundConfig) {
      routes.push(notFoundConfig)
    }

    this._routes = routes

    return routes
  }

  async loadSyncModule () {
    const modulesConfig = this._modulesConfig
    // load not lazy modules
    await runFlow(modulesConfig, undefined, (value, key) => {
      if (value.lazy === false) {
        return this.getModule(value.name, true)
      }
    })
  }

  async mount () {
    const { container } = this._options
    const routes = this._routes
    await this.loadSyncModule()
    const Loading = this._packedModules['loading']
    const App = this._packedModules['app']
    const Comp = () => {
      return (
        <Router>
          <Suspense fallback={<Loading />}>
            <Switch>
              {
                routes.map(config => {
                  return this.asyncRoute(config)
                })
              }
            </Switch>
          </Suspense>
        </Router>
      )
    }
    const Container = () => {
      return App ? <App>
        <Comp />
      </App> : <Comp />
    }

    ReactDOM.render(<Container />, typeof container === 'string' ? document.querySelector(container) : container)

    // for unit test
    return Container
  }

  asyncRoute (config) {
    const { name, route = {}, lazy } = config
    let component
    if (lazy === false) {
      component = this._packedModules[name]
    } else {
      component = (
        React.lazy(() => (
          this.getModule(name, true)
        ))
      )
    }

    return <Route key={name} {...route} component={component} />
  }
}
