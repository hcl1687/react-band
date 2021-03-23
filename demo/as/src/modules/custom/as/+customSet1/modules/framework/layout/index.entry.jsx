import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import zhCN from './i18n/zh-CN.json'

const entry = async ({ getModule }) => {
  const Menu = await getModule('menu')
  const Header = await getModule('header')
  const Breadcrumb = await getModule('breadcrumb')
  function Layout (props) {
    const { LEFT_STATUS, LAYOUT_MODE, theme, children, showLeft } = props

    const isTopMode = LAYOUT_MODE === 'top'
    const layoutClassName = classnames('layout', {
      'top-mode': isTopMode
    })

    const leftMaskClassName = classnames('left-mask', theme.leftMask, {
      [theme.collapsed]: !LEFT_STATUS
    })
    const leftClassName = classnames('left', theme.left, {
      [theme.collapsed]: !LEFT_STATUS
    })
    const rightClassName = classnames('right', theme.right, {
      [theme.expand]: !LEFT_STATUS
    })

    const hideLeft = (e) => {
      e.stopPropagation()
      showLeft(false)
    }

    return <div className={layoutClassName}>
      <div className={`header ${theme.header}`}>
        <Header />
      </div>
      {
        isTopMode ? <div className={`nav ${theme.nav}`}>
          <div className={`nav-inner ${theme.navInner}`}>
            <Menu mode='horizontal' expand={LEFT_STATUS} />
          </div>
        </div> : null
      }
      {
        isTopMode ? <div className={`content ${theme.content}`}>
          <div className={`middle ${theme.middle}`}>
            <Breadcrumb />
            <div className={`main ${theme.main}`}>
              {children}
            </div>
          </div>
        </div> : <div className={`content ${theme.content}`}>
          <div className={leftMaskClassName} onClick={hideLeft} />
          <div className={leftClassName}>
            <Menu expand={LEFT_STATUS} />
          </div>
          <div className={rightClassName}>
            <Breadcrumb />
            <div className={`main ${theme.main}`}>
              {children}
            </div>
          </div>
        </div>
      }
    </div>
  }

  Layout.propTypes = {
    theme: PropTypes.object.isRequired,
    LEFT_STATUS: PropTypes.bool.isRequired,
    LAYOUT_MODE: PropTypes.string.isRequired,
    children: PropTypes.any,
    showLeft: PropTypes.func.isRequired
  }

  return Layout
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
