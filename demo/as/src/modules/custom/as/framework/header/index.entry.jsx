import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import queryString from 'query-string'
import userFactory from './factories/user'

export default async (RB_CONTEXT) => {
  const { getModule, options } = RB_CONTEXT
  const antd = await getModule('antd')
  const Login = await getModule('login')
  const User = await userFactory(RB_CONTEXT)
  const { Button, Dropdown, Menu, Select } = antd
  const { Option } = Select

  function Header (props) {
    const handleToggleMenu = () => {
      const { showLeft, LEFT_STATUS } = props
      showLeft && showLeft(!LEFT_STATUS)
    }

    const handleThemeChange = (value) => {
      const parsed = queryString.parse(location.search)
      parsed.theme = value
      location.search = queryString.stringify(parsed)
    }

    const handleLocaleChange = (value) => {
      const parsed = queryString.parse(location.search)
      parsed.locale = value
      location.search = queryString.stringify(parsed)
    }

    const handleLogin = () => {
      const { notify } = props
      notify('loginModal', 'show', {
        visible: true
      })
    }

    const handleLogout = () => {
      const { logout } = props
      logout && logout()
    }

    const createLogin = () => {
      const { AUTH = {}, __, theme } = props
      if (!AUTH.uid) {
        // not login, show login button
        return <Button onClick={handleLogin}>
          {__('login')}
        </Button>
      }

      // show user info
      const menu = <Menu>
        <Menu.Item>
          <div className={theme.logout} onClick={handleLogout}>
            <span className={theme.logoutImg} />
            <span className={theme.logoutTxt}>
              {__('logout')}
            </span>
          </div>
        </Menu.Item>
      </Menu>

      return <Dropdown overlay={menu}>
        <div>
          <User {...props} />
        </div>
      </Dropdown>
    }

    const { theme, LEFT_STATUS, __, getNotification } = props
    const menuIconClass = classnames(theme.menuIcon, {
      [theme.menuShow]: LEFT_STATUS,
      [theme.menuHide]: !LEFT_STATUS
    })
    const { theme: themeType, locale, themes, languages } = options
    return <div className={theme.header}>
      <div className={theme.left}>
        <div className={theme.menu} onClick={handleToggleMenu}>
          <span className={menuIconClass} />
        </div>
        <div className={theme.logo} />
      </div>
      <div className={theme.right}>
        <div className={theme.themeType}>
          <Select defaultValue={themeType} style={{ width: 120 }} onChange={handleThemeChange}>
            {
              themes.map((item, i) => {
                return <Option key={i} value={item}>
                  {__(item)}
                </Option>
              })
            }
          </Select>
        </div>
        <div className={theme.locale}>
          <Select defaultValue={locale} style={{ width: 120 }} onChange={handleLocaleChange}>
            {
              languages.map((item, i) => {
                return <Option key={i} value={item}>
                  {__(item)}
                </Option>
              })
            }
          </Select>
        </div>
        <div className={theme.login}>
          {createLogin()}
        </div>
        <Login {...getNotification('loginModal')} />
      </div>
    </div>
  }

  Header.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    showLeft: PropTypes.func.isRequired,
    LEFT_STATUS: PropTypes.bool.isRequired,
    AUTH: PropTypes.object,
    logout: PropTypes.func.isRequired,
    getNotification: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired
  }

  Header.defaultProps = {
    AUTH: {}
  }

  return Header
}
