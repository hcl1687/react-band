import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import menus from './menus'

export default async (RB_CONTEXT) => {
  const { getModule } = RB_CONTEXT
  const antdIcon = await getModule('antdIcon')
  const antd = await getModule('antd')
  const { Menu } = antd

  function MenuComp (props, ref) {
    const { __, setNotifyHandler, LEFT_STATUS } = props
    const [show, setShow] = useState(true)
    const location = useLocation()
    const history = useHistory()

    const handleClick = (e) => {
      const key = e.key
      const menu = menus[key]
      history.push(menu.path)
    }

    const createMenus = () => {
      const selectedKeys = []
      menus.forEach((menu, i) => {
        if (menu.path === location.pathname) {
          selectedKeys.push('' + i)
        }
      })

      return <Menu mode='inline' selectedKeys={selectedKeys} inlineCollapsed={!LEFT_STATUS}
        onClick={handleClick}>
        {
          menus.map((item, i) => {
            const { name, icon } = item
            const MenuIcon = antdIcon[icon]
            return <Menu.Item key={i} icon={<MenuIcon className={theme.menuIcon} />}>
              {__(name)}
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
    }, ref)

    const { theme } = props
    return <div className={theme.menu} style={{ display: show ? 'block' : 'none' }}>
      {createMenus()}
    </div>
  }

  MenuComp.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    setNotifyHandler: PropTypes.func.isRequired,
    LEFT_STATUS: PropTypes.bool.isRequired
  }

  return MenuComp
}
