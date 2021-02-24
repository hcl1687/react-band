import PropTypes, { InferProps } from 'prop-types'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import menus from './menus'

export default (): RB.IRBComponent => {
  function Menu (props: InferProps<typeof Menu.propTypes>, ref) {
    const { __, setNotifyHandler } = props
    const [show, setShow] = useState(true)
    const theme = props.theme as RB.IRBTheme
    const createMenus = () => {
      return <ul className='menu'>
        {
          menus.map((item: Menu.IMenu, i: number) => {
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
    }, ref)

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
