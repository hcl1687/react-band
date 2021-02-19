import { IRBCompModule, IRBConfig, IRBConfigMap, IRBContext, IRBCore, IRBDecoModule, IRBI18n, IRBI18nRaw,
  IRBI18nsMap, IRBModule, IRBModuleConfig, IRBModuleFactory, IRBModulesMap, IRBOptions, IRBTheme, IRBThemeRaw, IRBThemesMap } from '~/interface'
import React, { ReactNode, Suspense } from 'react'
import { Route, HashRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import flowFactory from 'promiseflow'
import getConfig from './getConfig'

const runFlow = flowFactory(Promise)
const DEFAULT_OPTIONS: IRBOptions = {
  locale: 'en',
  theme: 'default',
  container: '#container'
}

export default class RBCore {
  private _options: IRBOptions

  private _modules: IRBModulesMap

  private _i18ns: IRBI18nsMap

  private _themes: IRBThemesMap

  private _packedModules: IRBModulesMap

  private _modulesConfig: IRBConfigMap

  private _routes: Array<IRBConfig>

  constructor (options: IRBOptions = {}) {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options)
    this._modules = {}
    this._i18ns = {}
    this._themes = {}
    this._packedModules = {}
    this._modulesConfig = getConfig(this._options)
    this._routes = this.createRoute()
  }

  static create (options: IRBOptions): IRBCore {
    return new RBCore(options)
  }

  public getContext (): IRBContext {
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

  private loadI18n (path: string, name: string): Promise<IRBI18nRaw | unknown> {
    const { locale } = this._options
    return this.fetchI18n(path, locale).then((i18n:IRBI18nRaw) => {
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
  private fetchI18n (path: string, locale: string): Promise<IRBI18nRaw> {
    path = path.replace(/^\.\//, '')
    return this.fetchI18nJSON(path, locale).catch(() => {
      return this.fetchI18nJS(path, locale)
    })
  }

  private fetchI18nJSON (path: string, locale: string): Promise<IRBI18nRaw> {
    return import(`~/modules/${path}/i18n/${locale}.json`)
  }

  private fetchI18nJS (path: string, locale: string): Promise<IRBI18nRaw> {
    return import(`~/modules/${path}/i18n/${locale}.js`)
  }

  private loadTheme (path: string, name: string): Promise<IRBThemeRaw | unknown> {
    const { theme } = this._options
    return this.fetchTheme(path, theme).then((themeObj: IRBThemeRaw) => {
      this._themes[name] = this._themes[name] || {}
      this._themes[name][theme] = themeObj['default']
      return themeObj
    })
  }

  private fetchTheme (path: string, theme: string): Promise<IRBThemeRaw> {
    path = path.replace(/^\.\//, '')
    return Promise.all([
      this.fetchLocalTheme(path, theme),
      this.fetchGlobalTheme(path, theme)
    ]).then(res => {
      return res && res[0]
    })
  }

  private fetchLocalTheme (path: string, theme: string): Promise<IRBThemeRaw> {
    return import(`~/modules/${path}/themes/${theme}/index.css`).catch(() => {
      return import(`~/modules/${path}/themes/default/index.css`).catch(() => {
        const res = {}
        res['default'] = {}
        return res
      })
    })
  }

  private fetchGlobalTheme (path: string, theme: string): Promise<unknown> {
    return import(`~/modules/${path}/themes/${theme}/index.global.css`).catch(() => {
      return import(`~/modules/${path}/themes/${theme}/index.global.css`).catch(() => {
        return {}
      })
    })
  }

  private async loadModule (path: string, name: string): Promise<{ default: IRBModule }> {
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

    const ret = {
      default: await this.packModule(name)
    }

    return ret
  }

  private fetchModule (path: string): Promise<{ default: IRBModuleFactory }> {
    path = path.replace(/^\.\//, '')
    return import(
      `~/modules/${path}/index.entry`
    )
  }

  private async packModule (name: string): Promise<IRBModule> {
    const { locale, theme } = this._options
    let module = this._modules[name]
    const i18n: IRBI18n = this._i18ns[name][locale]
    const themeObj: IRBTheme = this._themes[name][theme]
    const RB_CONTEXT = this.getContext()

    const config: IRBConfig = this._modulesConfig[name]
    if (config.type !== 'decorator') {
      // get decorators from config
      const { decorators = [] } = config
      for (let i = 0; i < decorators.length; i++) {
        const deco = decorators[i]
        const decoModule = await this.getModule(deco)
        const decoConfig = this._modulesConfig[deco]
        const decoI18n = this._i18ns[deco][locale]
        const decoThemeObj = this._themes[deco][theme]
        const moduleCompConfig: IRBModuleConfig = {
          ...config,
          i18n,
          theme: themeObj
        }
        const moduleDecoConfig: IRBModuleConfig = {
          ...decoConfig,
          i18n: decoI18n,
          theme: decoThemeObj
        }
        if (decoModule) {
          module = await (decoModule as IRBDecoModule)(moduleCompConfig, moduleDecoConfig, RB_CONTEXT)(module as IRBCompModule)
        }
      }
    }

    this._packedModules[name] = module

    return module
  }

  public getModule = async (name: string): Promise<IRBModule | undefined> => {
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

  private createRoute (): Array<IRBConfig> {
    const modulesConfig = this._modulesConfig
    let homeConfig: IRBConfig
    let notFoundConfig: IRBConfig
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

  private async loadSyncModule (): Promise<void> {
    const modulesConfig = this._modulesConfig
    // load not lazy modules
    await runFlow(modulesConfig, undefined, (value: IRBConfig) => {
      if (value.lazy === false) {
        return this.loadModule(value.key, value.name)
      }
    })
  }

  async mount (): Promise<React.FC> {
    const { container } = this._options
    const routes = this._routes
    await this.loadSyncModule()
    const Loading = this._packedModules['loading'] as IRBCompModule
    const App = this._packedModules['app'] as IRBCompModule
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

  private async lazyLoadModule (key: string, name: string): Promise<{ default: React.FC }> {
    const Comp = await this.loadModule(key, name)
    return {
      default: Comp.default as React.FC
    }
  }

  private asyncRoute (config: IRBConfig): ReactNode {
    const { name, route = {}, lazy, key } = config
    let component: IRBCompModule
    if (lazy === false) {
      component = this._packedModules[name] as IRBCompModule
    } else {
      component = (
        React.lazy(() => (
          this.lazyLoadModule(key, name)
        ))
      )
    }

    return <Route key={name} {...route} component={component} />
  }
}
