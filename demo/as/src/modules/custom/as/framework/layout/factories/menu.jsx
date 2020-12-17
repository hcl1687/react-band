import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import menus from './menus'

export default () => {
  function Menu (props) {
    const [show] = useState(true)
    const { theme, __ } = props
    const createMenus = () => {
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

    return <div className={theme.menus}>
      <div style={{ display: show ? 'block' : 'none' }}>
        {createMenus()}
      </div>
    </div>
  }

  Menu.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  }

  return Menu
}
