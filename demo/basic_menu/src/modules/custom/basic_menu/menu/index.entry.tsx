import PropTypes, { InferProps } from 'prop-types'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import darkgray from './themes/darkgray/index.css'
import defaultTheme from './themes/default/index.css'
import en from './i18n/en.json'
import menus from './menus'
import zhCN from './i18n/zh-CN.json'

const entry = (): RB.IRBComponent => {
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
