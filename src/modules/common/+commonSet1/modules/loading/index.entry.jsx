import PropTypes from 'prop-types'
import React from 'react'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = () => {
  function Loading (props) {
    const { __, theme } = props
    return <div className={theme.loading}>{__('loading')}</div>
  }

  Loading.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Loading
}

const i18n = (RB_CONTEXT) => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT) => {
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
