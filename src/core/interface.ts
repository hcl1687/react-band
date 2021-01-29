import React from 'react'

export interface IRBOptions {
  locale?: string
  theme?: string
  container?: string
  exclude?: boolean | RegExp | ((key: string) => boolean)
}

export interface IConfig {
  name: string
  key?: string
  category?: string
  disabled?: boolean
}

export interface IConfigMap {
  [propName: string]: IConfig
}

export interface IConfigFunctionMap {
  [propName: string]: (RB_OPTIONS) => IConfig
}

export interface IConfigReq {
  (key: string): {
    default: (RB_OPTIONS) => IConfig
  }
  keys: () => Array<string>
}

export interface IRBModulesMap {
  [propName: string]: React.FC
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

export interface IRBPackedModulesMap {
  [moduleName: string]: React.FC
}

export interface IRBCore {
  mount: () => Promise<React.FC>
}
