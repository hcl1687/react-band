import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import menus from './menus'

export default () => {
  return class Menu extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      MENU_STATUS: PropTypes.bool.isRequired
    }

    createMenus () {
      const { __ } = this.props
      return <ul className='menu'>
        {
          menus.map((item, i) => {
            const { path, name } = item
            return <li key={i}>
              <Link to={path}>{__(name)}</Link>
            </li>
          })
        }
      </ul>
    }

    render () {
      const { theme, MENU_STATUS } = this.props
      return <div className={theme.menus} style={{ display: MENU_STATUS ? 'block' : 'none' }}>
        <div>
          {this.createMenus()}
        </div>
      </div>
    }
  }
}
