import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import menus from './menus'

export default async (RB_CONTEXT) => {
  const { getModule } = RB_CONTEXT
  const AsIcon = await getModule('asIcon')
  const antd = await getModule('antd')
  const { Menu } = antd

  function MenuComp (props) {
    const { __, setNotifyHandler } = props
    const [show, setShow] = useState(true)
    const createMenus = () => {
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

    const toggleMenu = () => {
      setShow(!show)
    }
    setNotifyHandler({
      toggleMenu
    })

    const { theme } = props
    return <div className={theme.menu} style={{ display: show ? 'block' : 'none' }}>
      {createMenus()}
    </div>
  }

  MenuComp.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    setNotifyHandler: PropTypes.func.isRequired
  }

  return MenuComp
}
