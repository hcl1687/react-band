import PropTypes, { InferProps } from 'prop-types'
import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import menus from './menus'
import zhCN from './i18n/zh-CN.json'

const entry = async (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBComponent> => {
  const { getModule, options } = RB_CONTEXT
  const antdIcon = await getModule('antdIcon')
  const antd = await getModule('antd') as ANTD.IANTD
  const { Menu } = antd

  function MenuComp (props: InferProps<typeof MenuComp.propTypes>, ref) {
    const { __, setNotifyHandler, expand, mode = 'inline' } = props
    const [show, setShow] = useState(true)
    const location = useLocation()
    const history = useHistory()
    const theme = props.theme as RB.IRBTheme

    const handleClick = (e) => {
      const { key } = e as Menu.IClickEvent
      const menu = menus[key]
      history.push(menu.path)
    }

    const createMenus = () => {
      const selectedKeys = []
      menus.forEach((menu: Menu.IMenu, i: number) => {
        if (menu.path === location.pathname) {
          selectedKeys.push('' + i)
        }
      })

      const { theme: themeType } = options
      let menuTheme: Menu.IThemeType = 'light'
      if (themeType !== 'default') {
        menuTheme = 'dark'
      }

      const inlineCollapsed = mode === 'inline' ? !expand : false

      return <Menu mode={mode as Menu.IModeType} selectedKeys={selectedKeys} inlineCollapsed={inlineCollapsed}
        theme={menuTheme} onClick={handleClick}>
        {
          menus.map((item: Menu.IMenu, i: number) => {
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

    return <div className={theme.menu} style={{ display: show ? 'block' : 'none' }}>
      {createMenus()}
    </div>
  }

  MenuComp.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    setNotifyHandler: PropTypes.func.isRequired,
    expand: PropTypes.bool.isRequired,
    mode: PropTypes.string
  }

  return MenuComp
}

const i18n = (RB_CONTEXT: RB.IRBContext): RB.IRBI18n => {
  const { locale } = RB_CONTEXT.options
  const i18ns = {
    en,
    'zh-CN': zhCN
  }

  return i18ns[locale]
}

const theme = (RB_CONTEXT: RB.IRBContext): RB.IRBTheme => {
  const { theme } = RB_CONTEXT.options
  const themes = {
    default: defaultTheme,
    darkgray
  }

  return themes[theme] || defaultTheme
}

export default {
  entry,
  i18n,
  theme
}
