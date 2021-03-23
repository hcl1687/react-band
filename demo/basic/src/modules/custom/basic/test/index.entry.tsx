import PropTypes, { InferProps } from 'prop-types'
import React from 'react'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = async (): Promise<RB.IRBComponent> => {
  function Test (props: InferProps<typeof Test.propTypes>) {
    const handleClick = () => {
      const history = props.history as RB.IRBHistory
      history.push('/')
    }

    const { __ } = props
    const theme = props.theme as RB.IRBTheme
    return <div className={theme.test}>
      <div className={theme.content}>{__('test')}</div>
      <button onClick={handleClick} >{__('toHome')}</button>
    </div>
  }

  Test.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  return Test
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
