import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'

export default async ({ getModule }) => {
  const Menu = await getModule('menu')
  const Header = await getModule('header')
  const Breadcrumb = await getModule('breadcrumb')
  function Layout (props) {
    const { LEFT_STATUS, LAYOUT_MODE, theme, children } = props

    const isTopMode = LAYOUT_MODE === 'top'
    const layoutClassName = classnames('layout', {
      'top-mode': isTopMode
    })

    const leftClassName = classnames('left', theme.left, {
      [theme.collapsed]: !LEFT_STATUS
    })
    const rightClassName = classnames('right', theme.right, {
      [theme.expand]: !LEFT_STATUS
    })

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
    children: PropTypes.any
  }

  return Layout
}
