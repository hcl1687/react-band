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

  loadI18n (path, name) {
    const { locale } = this._options
    return this.fetchI18n(path, locale).then(i18n => {
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = i18n['default']
      return i18n
    }).catch(() => {
      this._i18ns[name] = this._i18ns[name] || {}
      this._i18ns[name][locale] = {}
      return {}
    })
  }

  // support json or js i18n file
  fetchI18n (path, locale) {
    path = path.replace(/^\.\//, '')
    return this.fetchI18nJSON(path, locale).catch(() => {
      return this.fetchI18nJS(path, locale)
    })
  }

  fetchI18nJSON (path, locale) {
    return import(`~/modules/${path}/i18n/${locale}.json`)
  }

  fetchI18nJS (path, locale) {
    return import(`~/modules/${path}/i18n/${locale}.js`)
  }

  loadTheme (path, name) {
    const { theme } = this._options
    return this.fetchTheme(path, theme).then(themeObj => {
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = themeObj['default']
      return themeObj
    })
  }

  fetchTheme (path, theme) {
    path = path.replace(/^\.\//, '')
    return Promise.all([
      this.fetchLocalTheme(path, theme),
      this.fetchGlobalTheme(path, theme)
    ]).then(res => {
      return res && res[0]
    })
  }

  fetchLocalTheme (path, theme) {
    return import(`~/modules/${path}/themes/${theme}/index.css`).catch(() => {
      const res = {}
      res['default'] = {}
      return res
    })
  }

  fetchGlobalTheme (path, theme) {
    return import(`~/modules/${path}/themes/${theme}/index.global.css`).catch(() => {
      return {}
    })
  }

  async loadModule (path, name) {
    // load i18n
    const i18nPromise = this.loadI18n(path, name)
    // load theme
    const themePromise = this.loadTheme(path, name)
    // load module
    const modulePromise = this.fetchModule(path)

    const res = await Promise.all([modulePromise, i18nPromise, themePromise])
    const moduleFactory = res[0]['default']
    const RB_CONTEXT = this.getContext()
    this._modules[name] = await moduleFactory(RB_CONTEXT)

    const ret = []
    ret['default'] = await this.packModule(name)
    return ret
  }

  fetchModule (path) {
    path = path.replace(/^\.\//, '')
    return import(
      `~/modules/${path}/index.entry`
    )
  }

  async packModule (name) {
    const { locale, theme } = this._options
    let module = this._modules[name]
    const i18n = this._i18ns[name][locale]
    const themeObj = this._themes[name][theme]
    const RB_CONTEXT = this.getContext()

    const config = this._modulesConfig[name]
    if (config.type !== 'decorator') {
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

  getModule = async (name) => {
    const config = this._modulesConfig[name]
    if (!config) {
      return
    }

    if (this._packedModules[name]) {
      return this._packedModules[name]
    }

    await this.loadModule(config.key, name)
    return this._packedModules[name]
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
        return this.loadModule(value.key, value.name)
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
  }

  asyncRoute (config) {
    const { name, route = {}, lazy, key } = config
    let component
    if (lazy === false) {
      component = this._packedModules[name]
    } else {
      component = (
        React.lazy(() => (
          this.loadModule(key, name)
        ), 'default')
      )
    }

    return <Route key={name} {...route} component={component} />
  }
}
