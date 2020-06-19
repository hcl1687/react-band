import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import menus from './menus'

export default async (RB_CONTEXT) => {
  const { getComponent } = RB_CONTEXT
  const AsIcon = await getComponent('asIcon')
  const antd = await getComponent('antd')
  const { Menu } = antd
  return class MenuComp extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired
    }

    constructor (props, context) {
      super(props, context)
      this.state = {
        show: true
      }
    }

    createMenus () {
      const { __ } = this.props
      return <Menu mode='inline'>
        {
          menus.map((item, i) => {
            const { path, name, icon } = item
            return <Menu.Item key={i}>
              <Link to={path}>
                <AsIcon mode='symbol' type={icon} />
                {__(name)}
              </Link>
            </Menu.Item>
          })
        }
      </Menu>
    }

    toggleMenu () {
      const { show } = this.state
      this.setState({
        show: !show
      })
    }

    render () {
      const { theme } = this.props
      const { show } = this.state
      return <div className={theme.menu} style={{ display: show ? 'block' : 'none' }}>
        {this.createMenus()}
      </div>
    }
  }
}
