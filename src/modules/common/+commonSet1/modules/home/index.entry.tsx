import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = (): RB.IRBComponent => {
  function Home (props: InferProps<typeof Home.propTypes>) {
    const { __ } = props
    const theme = props.theme as RB.IRBTheme
    return <div className={theme.home}>{__('home')}</div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Home
}

const i18n = (RB_CONTEXT: RB.IRBContext): RB.IRBI18n => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT: RB.IRBContext): RB.IRBTheme => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
