import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import menus from './menus'

export default () => {
  return class Menu extends Component {
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

    toggleMenu () {
      const { show } = this.state
      this.setState({
        show: !show
      })
    }

    render () {
      const { theme } = this.props
      const { show } = this.state
      return <div className={theme.menus}>
        <div style={{ display: show ? 'block' : 'none' }}>
          {this.createMenus()}
        </div>
      </div>
    }
  }
}
