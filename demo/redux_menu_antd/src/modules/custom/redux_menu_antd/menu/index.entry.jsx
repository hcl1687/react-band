import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import menus from './menus'

export default () => {
  function Menu (props) {
    const { __, theme, setNotifyHandler } = props
    const [show, setShow] = useState(true)

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

    const toggleMenu = () => {
      setShow(!show)
    }
    setNotifyHandler({
      toggleMenu
    })

    return <div className={theme.menus}>
      <div style={{ display: show ? 'block' : 'none' }}>
        {createMenus()}
      </div>
    </div>
  }

  Menu.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    setNotifyHandler: PropTypes.func.isRequired
  }

  return Menu
}
