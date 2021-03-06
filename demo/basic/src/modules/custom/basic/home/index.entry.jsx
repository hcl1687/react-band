import PropTypes from 'prop-types'
import React from 'react'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = (RB_CONTEXT) => {
  function Home (props) {
    const handleClick = () => {
      const { history } = props
      history.push('/test')
    }

    const { __, theme } = props
    return <div className={theme.home}>
      <div className={theme.content}>{__('home')}</div>
      <button onClick={handleClick}>{__('toTest')}</button>
    </div>
  }

  Home.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  return Home
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
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
