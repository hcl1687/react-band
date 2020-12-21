import React, { useState } from 'react'
import PropTypes from 'prop-types'
import avatarFactory from './factories/avatar'
import classnames from 'classnames'
import queryString from 'query-string'
import userFactory from './factories/user'

export default async (RB_CONTEXT) => {
  const { getModule, options } = RB_CONTEXT
  const antd = await getModule('antd')
  const antdIcon = await getModule('antdIcon')
  const Login = await getModule('login')
  const Avatar = await avatarFactory(RB_CONTEXT)
  const User = await userFactory(RB_CONTEXT)
  const { Button, Drawer, Dropdown, Menu, Radio } = antd
  const { CheckOutlined, EditOutlined, GlobalOutlined, LoginOutlined, LogoutOutlined, MenuFoldOutlined,
    MenuUnfoldOutlined, SettingOutlined } = antdIcon || {}

  function Header (props) {
    const [visible, setVisible] = useState(false)
    const showDrawer = () => {
      setVisible(true)
    }
    const onClose = () => {
      setVisible(false)
    }

    const handleToggleMenu = () => {
      const { showLeft, LEFT_STATUS } = props
      showLeft && showLeft(!LEFT_STATUS)
    }

    const handleThemeChange = (e) => {
      const value = e.target.value
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

    const handleEditProfile = () => {
    }

    const createLogin = () => {
      const { AUTH = {}, __, theme } = props
      if (!AUTH.uid) {
        // not login, show login button
        return <Button icon={<LoginOutlined />} onClick={handleLogin}>
          {__('login')}
        </Button>
      }

      // show user info
      const menu = <Menu>
        <Menu.Item className={theme.userItem}>
          <User {...props} />
        </Menu.Item>
        <Menu.Item>
          <div onClick={handleEditProfile}>
            <EditOutlined />
            <span>
              {__('editProfile')}
            </span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={handleLogout}>
            <LogoutOutlined />
            <span>
              {__('logout')}
            </span>
          </div>
        </Menu.Item>
      </Menu>

      return <Dropdown overlay={menu} overlayClassName={theme.loginOverlay} trigger={['click']}>
        <div className={theme.avatarWrapper}>
          <Avatar {...props} />
        </div>
      </Dropdown>
    }

    const createLocale = () => {
      const { locale } = options
      const menu = <Menu>
        {
          languages.map((item, i) => {
            return <Menu.Item key={i} value={item} onClick={() => { handleLocaleChange(item) }}>
              <div className={theme.localeItem}>
                <div className={theme.localeName}>{__(item)}</div>
                { item === locale ? <CheckOutlined className={theme.localeIndicator} /> : null }
              </div>
            </Menu.Item>
          })
        }
      </Menu>

      return <Dropdown overlay={menu} overlayClassName={theme.localeOverlay} trigger={['click']}>
        <GlobalOutlined />
      </Dropdown>
    }

    const createSetting = () => {
      const { theme, themes } = options
      const themeOpts = themes.map((item, i) => {
        return { label: __(item), value: item }
      })

      return <div>
        <SettingOutlined onClick={showDrawer} />
        <Drawer
          className='config-drawer'
          title={__('configTitle')}
          placement='right'
          width={350}
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <div className='config-item'>
            <span className='label'>{__('themeType')}</span>
            <Radio.Group
              options={themeOpts}
              onChange={handleThemeChange}
              value={theme}
              optionType='button'
            />
          </div>
        </Drawer>
      </div>
    }

    const { theme, LEFT_STATUS, __, getNotification } = props
    const { languages } = options
    const headerClass = classnames(theme.header, {
      [theme.collapse]: !LEFT_STATUS
    })

    return <div className={headerClass}>
      <div className={theme.left}>
        <div className={theme.logo}>
          <span className={theme.logoImg} />
        </div>
        <div className={theme.menu} onClick={handleToggleMenu}>
          {
            LEFT_STATUS ? <MenuFoldOutlined className={theme.menuIcon} /> : <MenuUnfoldOutlined className={theme.menuIcon} />
          }
        </div>
      </div>
      <div className={theme.right}>
        <div className={theme.locale}>
          {createLocale()}
        </div>
        <div className={theme.login}>
          {createLogin()}
        </div>
        <div className={theme.setting}>
          {createSetting()}
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
