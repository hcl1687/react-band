import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default async ({ getComponent }) => {
  const Menu = await getComponent('menu')
  const Header = await getComponent('header')
  return class Layout extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      LEFT_STATUS: PropTypes.bool.isRequired,
      HEAD_STATUS: PropTypes.bool.isRequired,
      children: PropTypes.any,
      getNotification: PropTypes.func.isRequired,
      notify: PropTypes.func.isRequired
    }

    handleToggleMenu = () => {
      const { notify } = this.props
      notify('menu', 'toggleMenu')
    }

    render () {
      const { LEFT_STATUS, HEAD_STATUS, theme, getNotification, children } = this.props
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
            <Menu {...getNotification('menu')} />
          </div>
          <div className={rightClassName}>
            {children}
          </div>
        </div>
      </div>
    }
  }
}
