import * as antd from 'antd'
import en from './i18n/en'
import zhCN from './i18n/zh-CN'

const entry = () => {
  return antd
}

const i18n = (RB_CONTEXT) => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = async (RB_CONTEXT) => {
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
