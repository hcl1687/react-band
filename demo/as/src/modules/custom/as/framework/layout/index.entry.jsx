import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'

export default async ({ getModule }) => {
  const Menu = await getModule('menu')
  const Header = await getModule('header')
  function Layout (props) {
    const { LEFT_STATUS, HEAD_STATUS, theme, children } = props

    const headDisplay = HEAD_STATUS ? 'block' : 'none'
    const leftClassName = classnames(theme.left, {
      [theme.collapsed]: !LEFT_STATUS
    })
    const rightClassName = classnames(theme.right, {
      [theme.expand]: !LEFT_STATUS
    })

    return <div className={theme.layout}>
      <div className={theme.header} style={{ display: headDisplay }}>
        <Header />
      </div>
      <div className={theme.content}>
        <div className={leftClassName}>
          <Menu LEFT_STATUS={LEFT_STATUS} />
        </div>
        <div className={rightClassName}>
          {children}
        </div>
      </div>
    </div>
  }

  Layout.propTypes = {
    theme: PropTypes.object.isRequired,
    LEFT_STATUS: PropTypes.bool.isRequired,
    HEAD_STATUS: PropTypes.bool.isRequired,
    children: PropTypes.any
  }

  return Layout
}
