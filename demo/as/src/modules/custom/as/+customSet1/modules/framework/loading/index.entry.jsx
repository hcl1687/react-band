import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = async ({ getModule }) => {
  const lottie = await getModule('lottie')

  function Loading (props) {
    const lottieDom = useRef(null)

    useEffect(() => {
      // wait 100ms to show loading animate.
      setTimeout(() => {
        if (lottieDom && lottieDom.current) {
          lottie.loadAnimation({
            container: lottieDom.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: './lottie/Loading/data.json'
          })
        }
      }, 100)
    }, [])

    const { __, theme } = props
    return <div className={theme.loading}>
      <div ref={lottieDom} className={theme.lottie} />
      <div className={theme.tip}>{__('loading')}</div>
    </div>
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
