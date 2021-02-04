import React from 'react'
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
  mount: () => Promise<React.FC>
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
