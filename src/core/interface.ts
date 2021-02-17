import React, { ReactNode } from 'react'
import { RouteProps } from 'react-router-dom'

export interface IRBOptions {
  locale?: string
  theme?: string
  container?: string
  exclude?: boolean | RegExp | ((key: string) => boolean)
}

export interface IRBConfig {
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

export interface IRBDecoConfig {
  i18n?: IRBI18n
  theme?: IRBTheme
}

export interface IRBConfigMap {
  [propName: string]: IRBConfig
}

export interface IRBConfigFunctionMap {
  [propName: string]: (RB_OPTIONS: IRBOptions) => IRBConfig
}

export interface IRBConfigReq {
  (key: string): {
    default: (RB_OPTIONS: IRBOptions) => IRBConfig
  }
  keys: () => Array<string>
}

export interface IRBModulesMap {
  [propName: string]: IRBModule
}

export interface IRBI18n {
  [key: string]: string
}

export interface IRBI18nRaw {
  default: IRBI18n
}

export interface IRBI18nsMap {
  [moduleName: string]: {
    [localeName: string]: IRBI18n
  }
}

export interface IRBTheme {
  [key: string]: string
}

export interface IRBThemeRaw {
  default: IRBTheme
}

export interface IRBThemesMap {
  [moduleName: string]: {
    [themeName: string]: IRBTheme
  }
}

export interface IRBCore {
  getContext: () => IRBContext
  getModule: (name: string) => Promise<IRBModule | undefined>
  fetchI18n: (path: string, locale: string) => Promise<IRBI18nRaw>
  loadI18n: (path: string, name: string) => Promise<IRBI18nRaw | unknown>
  fetchI18nJSON: (path: string, locale: string) => Promise<IRBI18nRaw>
  fetchI18nJS: (path: string, locale: string) => Promise<IRBI18nRaw>
  loadTheme: (path: string, name: string) => Promise<IRBThemeRaw | unknown>
  fetchTheme: (path: string, theme: string) => Promise<IRBThemeRaw>
  fetchLocalTheme: (path: string, theme: string) => Promise<IRBThemeRaw>
  fetchGlobalTheme: (path: string, theme: string) => Promise<unknown>
  packModule: (name: string) => Promise<IRBModule>
  fetchModule: (path: string) => Promise<{ default: IRBModuleFactory }>
  loadModule: (path: string, name: string) => Promise<{ default: IRBModule }>
  mount: () => Promise<React.FC>
  createRoute: () => Array<IRBConfig>
  loadSyncModule: () => Promise<void>
  asyncRoute: (config: IRBConfig) => ReactNode
}

export interface IRBDecoModule {
  (config: IRBConfig, decoConfig: IRBDecoConfig, RB_CONTEXT: IRBContext): IRBDecoFactory
}

export type IRBCompModule = React.FC
export interface IRBDecoFactory {
  (WrappedComponent: React.FC): React.FC
}

export interface IRBContext {
  options: IRBOptions
  modules: IRBModulesMap
  i18ns: IRBI18nsMap
  themes: IRBThemesMap
  packedModules: IRBModulesMap
  modulesConfig: IRBConfigMap
  routes: Array<IRBConfig>
  getModule: (name: string) => Promise<IRBModule | undefined>
}

export type IRBModule = IRBCompModule | IRBDecoModule

export interface IRBModuleFactory {
  (RB_CONTEXT: IRBContext): IRBModule
}
