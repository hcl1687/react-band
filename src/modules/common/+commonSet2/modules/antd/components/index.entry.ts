
import * as antd from 'antd'
import en from './i18n/en'
import zhCN from './i18n/zh-CN'

const entry = (): RB.IRBModule => {
  return antd
}

const i18n = (RB_CONTEXT: RB.IRBContext): RB.IRBI18n => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = async (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBTheme> => {
  const { theme } = RB_CONTEXT.options
  if (theme === 'darkgray') {
    return import('./themes/darkgray/index.global.css').then(() => {
      return {}
    })
  }

  return import('./themes/default/index.global.css').then(() => {
    return {}
  })
}

export default {
  entry,
  i18n,
  theme
}
