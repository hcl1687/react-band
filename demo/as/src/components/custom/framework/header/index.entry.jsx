import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import queryString from 'query-string'
import userFactory from './factories/user'

export default async (RB_CONTEXT) => {
  const { getComponent, options } = RB_CONTEXT
  const antd = await getComponent('antd')
  const Login = await getComponent('login')
  const User = await userFactory(RB_CONTEXT)
  const { Button, Dropdown, Menu, Select } = antd
  const { Option } = Select
  return class Header extends Component {
    static propTypes = {
      __: PropTypes.func.isRequired,
      theme: PropTypes.object.isRequired,
      showLeft: PropTypes.func.isRequired,
      LEFT_STATUS: PropTypes.bool.isRequired,
      AUTH: PropTypes.object,
      logout: PropTypes.func.isRequired,
      getNotification: PropTypes.func.isRequired,
      notify: PropTypes.func.isRequired
    }

    static defaultProps = {
      AUTH: {}
    }

    handleToggleMenu = () => {
      const { showLeft, LEFT_STATUS } = this.props
      showLeft && showLeft(!LEFT_STATUS)
    }

    handleThemeChange = (value) => {
      const parsed = queryString.parse(location.search)
      parsed.theme = value
      location.search = queryString.stringify(parsed)
    }

    handleLocaleChange = (value) => {
      const parsed = queryString.parse(location.search)
      parsed.locale = value
      location.search = queryString.stringify(parsed)
    }

    handleLogin = () => {
      const { notify } = this.props
      notify('loginModal', 'show', {
        visible: true
      })
    }

    handleLogout = () => {
      const { logout } = this.props
      logout && logout()
    }

    createLogin () {
      const { AUTH = {}, __, theme } = this.props
      if (!AUTH.uid) {
        // not login, show login button
        return <Button onClick={this.handleLogin}>
          {__('login')}
        </Button>
      }

      // show user info
      const menu = <Menu>
        <Menu.Item>
          <div className={theme.logout} onClick={this.handleLogout}>
            <span className={theme.logoutImg} />
            <span className={theme.logoutTxt}>
              {__('logout')}
            </span>
          </div>
        </Menu.Item>
      </Menu>

      return <Dropdown overlay={menu}>
        <div>
          <User {...this.props} />
        </div>
      </Dropdown>
    }

    render () {
      const { theme, LEFT_STATUS, __, getNotification } = this.props
      const menuIconClass = classnames(theme.menuIcon, {
        [theme.menuShow]: LEFT_STATUS,
        [theme.menuHide]: !LEFT_STATUS
      })
      const { theme: themeType, locale, themes, languages } = options
      return <div className={theme.header}>
        <div className={theme.left}>
          <div className={theme.menu} onClick={this.handleToggleMenu}>
            <span className={menuIconClass} />
          </div>
          <div className={theme.logo} />
        </div>
        <div className={theme.right}>
          <div className={theme.themeType}>
            <Select defaultValue={themeType} style={{ width: 120 }} onChange={this.handleThemeChange}>
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
            <Select defaultValue={locale} style={{ width: 120 }} onChange={this.handleLocaleChange}>
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
            {this.createLogin()}
          </div>
          <Login {...getNotification('loginModal')} />
        </div>
      </div>
    }
  }
}
