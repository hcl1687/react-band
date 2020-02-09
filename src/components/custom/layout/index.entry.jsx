import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default async ({ getComponent }) => {
  const Menu = await getComponent('menu')
  return class BasicLayout extends Component {
    static propTypes = {
      theme: PropTypes.object.isRequired,
      LEFT_STATUS: PropTypes.bool.isRequired,
      HEAD_STATUS: PropTypes.bool.isRequired,
      children: PropTypes.object.isRequired
    }

    render () {
      const { LEFT_STATUS, HEAD_STATUS, theme, children } = this.props
      const headDisplay = HEAD_STATUS ? 'block' : 'none'
      const leftDisplay = LEFT_STATUS ? 'block' : 'none'

      return <div className={theme.layout}>
        <div className='header' style={{ display: headDisplay }}>head</div>
        <div className='content'>
          <div className='left' style={{ display: leftDisplay }}>
            <Menu />
          </div>
          <div className='right'>
            {children}
          </div>
        </div>
      </div>
    }
  }
}
