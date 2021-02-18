import React from 'react'
import { RouteProps } from 'react-router-dom'

interface IRBOptions {
  locale?: string
  theme?: string
  container?: string
  exclude?: boolean | RegExp | ((key: string) => boolean)
}

interface IRBConfig {
  name: string
  key?: string
  category?: string
  disabled?: boolean
  type?: string
  decorators?: Array<string>
  i18n?: IRBI18n
  theme?: IRBTheme
  route?: RouteProps
  lazy?: boolean
}

interface IRBDecoConfig {
  i18n?: IRBI18n
  theme?: IRBTheme
}

interface IRBConfigMap {
  [propName: string]: IRBConfig
}

interface IRBConfigFunctionMap {
  [propName: string]: (RB_OPTIONS: IRBOptions) => IRBConfig
}

interface IRBConfigReq {
  (key: string): {
    default: (RB_OPTIONS: IRBOptions) => IRBConfig
  }
  keys: () => Array<string>
}

interface IRBModulesMap {
  [propName: string]: IRBModule
}

interface IRBI18n {
  [key: string]: string
}

interface IRBI18nRaw {
  default: IRBI18n
}

interface IRBI18nsMap {
  [moduleName: string]: {
    [localeName: string]: IRBI18n
  }
}

interface IRBTheme {
  [key: string]: string
}

interface IRBThemeRaw {
  default: IRBTheme
}

interface IRBThemesMap {
  [moduleName: string]: {
    [themeName: string]: IRBTheme
  }
}

interface IRBCore {
  getContext: () => IRBContext
  getModule: (name: string) => Promise<IRBModule | undefined>
  mount: () => Promise<React.FC>
}

interface IRBDecoModule {
  (config: IRBConfig, decoConfig: IRBDecoConfig, RB_CONTEXT: IRBContext): IRBDecoFactory
}

type IRBCompModule = React.FC
interface IRBDecoFactory {
  (WrappedComponent: React.FC): React.FC
}

interface IRBContext {
  options: IRBOptions
  modules: IRBModulesMap
  i18ns: IRBI18nsMap
  themes: IRBThemesMap
  packedModules: IRBModulesMap
  modulesConfig: IRBConfigMap
  routes: Array<IRBConfig>
  getModule: (name: string) => Promise<IRBModule | undefined>
}

type IRBModule = IRBCompModule | IRBDecoModule

interface IRBModuleFactory {
  (RB_CONTEXT: IRBContext): IRBModule
}
