import PropTypes, { InferProps } from 'prop-types'
import React, { useState } from 'react'
import avatarFactory from './factories/avatar'
import classnames from 'classnames'
import queryString from 'query-string'
import userFactory from './factories/user'

export default async (RB_CONTEXT: RB.IRBContext): Promise<RB.IRBComponent> => {
  const { getModule, options } = RB_CONTEXT
  const antd = await getModule('antd') as ANTD.IANTD
  const antdIcon = await getModule('antdIcon')
  const Login = await getModule('login') as RB.IRBComponent
  const Profile = await getModule('profile') as RB.IRBComponent
  const Avatar = await avatarFactory(RB_CONTEXT)
  const User = await userFactory(RB_CONTEXT)
  const { Button, Drawer, Dropdown, Menu, Radio } = antd
  const { CheckOutlined, EditOutlined, GlobalOutlined, LoginOutlined, LogoutOutlined, MenuFoldOutlined,
    MenuUnfoldOutlined, SettingOutlined } = antdIcon || {}

  function Header (props: InferProps<typeof Header.propTypes>) {
    const { showLeft, LEFT_STATUS, LAYOUT_MODE, __, notify, getNotification, logout,
      setLayout, teacher } = props
    const theme = props.theme as RB.IRBTheme
    const AUTH = props.AUTH as AsUtils.IAuth
    const [visible, setVisible] = useState(false)
    const showDrawer = () => {
      setVisible(true)
    }
    const onClose = () => {
      setVisible(false)
    }

    const handleToggleMenu = () => {
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
      notify('loginModal', 'show', {
        visible: true
      })
    }

    const handleLogout = () => {
      logout && logout()
    }

    const handleEditProfile = () => {
      notify('profileModal', 'show', {
        visible: true
      })
    }

    const handleLayoutChange = (e) => {
      const value = e.target.value
      setLayout && setLayout(value)
    }

    const createLogin = () => {
      if (!AUTH.uid) {
        // not login, show login button
        return <Button icon={<LoginOutlined />} onClick={handleLogin}>
          {__('login')}
        </Button>
      }

      // show user info
      let user = {}
      if (AUTH.role === 'Teacher') {
        user = teacher
      }
      const menu = <Menu>
        <Menu.Item className={theme.userItem}>
          <User {...props} user={user} />
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
          <Avatar {...props} user={user} />
        </div>
      </Dropdown>
    }

    const createLocale = () => {
      const { locale } = options
      const menu = <Menu>
        {
          languages.map((item: string, i: number) => {
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
      const themeOpts = themes.map((item: string) => {
        return { label: __(item), value: item }
      })
      const layoutOpts = [{
        label: __('left'),
        value: 'left'
      }, {
        label: __('top'),
        value: 'top'
      }]

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
          <div className='config-item'>
            <span className='label'>{__('layoutType')}</span>
            <Radio.Group
              options={layoutOpts}
              onChange={handleLayoutChange}
              value={LAYOUT_MODE}
              optionType='button'
            />
          </div>
        </Drawer>
      </div>
    }

    const { languages } = options
    const isTopMode = LAYOUT_MODE === 'top'
    const headerClass = classnames(theme.header, {
      [theme.collapse]: !LEFT_STATUS,
      [theme.topMode]: isTopMode
    })

    return <div className={headerClass}>
      <div className={theme.left}>
        <div className={theme.logo}>
          <span className={theme.logoImg} />
        </div>
        {
          !isTopMode ? <div className={theme.menu} onClick={handleToggleMenu}>
            {
              LEFT_STATUS ? <MenuFoldOutlined className={theme.menuIcon} /> : <MenuUnfoldOutlined className={theme.menuIcon} />
            }
          </div> : null
        }
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
        <Profile {...getNotification('profileModal')} />
      </div>
    </div>
  }

  Header.propTypes = {
    __: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    showLeft: PropTypes.func.isRequired,
    LEFT_STATUS: PropTypes.bool.isRequired,
    LAYOUT_MODE: PropTypes.string.isRequired,
    AUTH: PropTypes.object,
    teacher: PropTypes.object,
    logout: PropTypes.func.isRequired,
    getNotification: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    setLayout: PropTypes.func.isRequired
  }

  Header.defaultProps = {
    AUTH: {}
  }

  return Header
}
