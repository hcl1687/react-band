import PropTypes from 'prop-types'
import React from 'react'
import headerFactory from '../index.entry'
import { mount } from 'enzyme'

jest.mock('../factories/avatar', () => {
  return () => {
    return function Avatar () {
      return <div>avatar</div>
    }
  }
})
jest.mock('../factories/user', () => {
  return () => {
    return function User () {
      return <div>user</div>
    }
  }
})

const RB_CONTEXT: RB.IRBContext = {
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  options: {
    themes: [
      'default',
      'darkgray'
    ],
    languages: [
      'en',
      'zh-CN'
    ],
    locale: 'en'
  },
  getModule: async (type: string) => {
    if (type === 'antd') {
      const Button = ({ onClick, ...rest }) => <div className='antd-button' onClick={onClick} data-props={rest} />
      Button.propTypes = {
        onClick: PropTypes.func
      }

      const Drawer = ({ children, onClose, ...rest }) => <div className='antd-drawer' data-props={rest}>
        {children}
        <span className='drawer-close' onClick={onClose} />
      </div>
      Drawer.propTypes = {
        children: PropTypes.any,
        onClose: PropTypes.func
      }
      const Dropdown = ({ children, overlay, ...rest }) => <div className='antd-dropdown' data-props={rest}>
        {children}
        {overlay}
      </div>
      Dropdown.propTypes = {
        children: PropTypes.any,
        overlay: PropTypes.any
      }
      const Menu = ({ children, ...rest }) => <div className='antd-menu' data-props={rest}>{children}</div>
      Menu.propTypes = {
        children: PropTypes.any
      }

      const Item = ({ children, onClick, ...rest }) => <div className='antd-menu-item' onClick={onClick} data-props={rest}>{children}</div>
      Item.propTypes = {
        children: PropTypes.any,
        onClick: PropTypes.func
      }
      Menu.Item = Item

      const Radio = (props) => <div className='antd-radio' data-props={props} />
      const Group = ({ onChange, ...rest }) => <div className='antd-radio-group' onChange={onChange} data-props={rest} />
      Group.propTypes = {
        onChange: PropTypes.func
      }
      Radio.Group = Group

      return {
        Button,
        Drawer,
        Dropdown,
        Menu,
        Radio
      }
    } else if (type === 'antdIcon') {
      return {
        CheckOutlined: (props) => <span className='antdicon-CheckOutlined' data-props={props} />,
        EditOutlined: (props) => <span className='antdicon-EditOutlined' data-props={props} />,
        GlobalOutlined: (props) => <span className='antdicon-GlobalOutlined' data-props={props} />,
        LoginOutlined: (props) => <span className='antdicon-LoginOutlined' data-props={props} />,
        LogoutOutlined: (props) => <span className='antdicon-LogoutOutlined' data-props={props} />,
        MenuFoldOutlined: (props) => <span className='antdicon-MenuFoldOutlined' data-props={props} />,
        MenuUnfoldOutlined: (props) => <span className='antdicon-MenuUnfoldOutlined' data-props={props} />,
        SettingOutlined: (props) => <span className='antdicon-SettingOutlined' {...props} />
      }
    } else if (type === 'login') {
      return (props) => {
        return <div className='loginModal' data-props={props} />
      }
    } else if (type === 'profile') {
      return (props) => {
        return <div className='profileModal' data-props={props} />
      }
    }
  }
}

const DEFAULT_PROPS = {
  __: (val: string) => (val),
  theme: {
    userItem: 'userItem',
    loginOverlay: 'loginOverlay',
    avatarWrapper: 'avatarWrapper',
    localeItem: 'localeItem',
    localeName: 'localeName',
    localeIndicator: 'localeIndicator',
    localeOverlay: 'localeOverlay',
    header: 'header',
    collapse: 'collapse',
    topMode: 'topMode',
    left: 'left',
    logo: 'logo',
    logoImg: 'logoImg',
    menu: 'menu',
    menuIcon: 'menuIcon',
    right: 'right',
    locale: 'locale',
    login: 'login',
    setting: 'setting'
  },
  showLeft: () => {},
  LEFT_STATUS: true,
  LAYOUT_MODE: 'left',
  AUTH: {
    uid: 'xxx',
    role: 'Teacher'
  },
  teacher: {},
  logout: () => {},
  getNotification: () => {},
  notify: () => {},
  setLayout: () => {}
}

describe('custom/as/framework/header', () => {
  it('should render correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }

    const wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.header').length).toBe(1)
    expect(wrapper.find('.collapse').length).toBe(0)
    expect(wrapper.find('.topMode').length).toBe(0)
    expect(wrapper.find('.left').length).toBe(1)
    expect(wrapper.find('.logo').length).toBe(1)
    expect(wrapper.find('.logoImg').length).toBe(1)
    expect(wrapper.find('.menu').length).toBe(1)
    expect(wrapper.find('.right').length).toBe(1)
    expect(wrapper.find('.locale').length).toBe(1)
    expect(wrapper.find('.login').length).toBe(1)
    expect(wrapper.find('.setting').length).toBe(1)
    expect(wrapper.find('.loginModal').length).toBe(1)
    expect(wrapper.find('.profileModal').length).toBe(1)
    expect(wrapper.find('.antd-dropdown').length).toBe(2)
    expect(wrapper.find('.avatarWrapper').length).toBe(1)
    expect(wrapper.find('.antdicon-GlobalOutlined').length).toBe(1)
    expect(wrapper.find('.antdicon-SettingOutlined').length).toBe(1)
    expect(wrapper.find('.antd-drawer').length).toBe(1)
    expect(wrapper.find('.config-item').length).toBe(2)
    expect(wrapper.find('.antdicon-MenuFoldOutlined').length).toBe(1)
    expect(wrapper.find('.antdicon-MenuUnfoldOutlined').length).toBe(0)

    expect(wrapper.find('.header').prop('className')).toBe('header')
  })

  it('should drawer correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }

    const wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.antd-drawer').length).toBe(1)
    expect(wrapper.find('.antd-drawer').prop('data-props')['visible']).toBe(false)
    expect(wrapper.find('.antdicon-SettingOutlined').length).toBe(1)
    wrapper.find('.antdicon-SettingOutlined').simulate('click')
    expect(wrapper.find('.antd-drawer').prop('data-props')['visible']).toBe(true)
    wrapper.find('.drawer-close').simulate('click')
    expect(wrapper.find('.antd-drawer').prop('data-props')['visible']).toBe(false)
  })

  it('should toggle menu correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)

    let wrapper = null
    const props = {
      ...DEFAULT_PROPS,
      showLeft: jest.fn((LEFT_STATUS) => {
        wrapper.setProps({
          LEFT_STATUS
        })
      })
    }

    wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.menu').length).toBe(1)
    expect(wrapper.find('.header').prop('className')).toBe('header')
    expect(wrapper.find('.antdicon-MenuFoldOutlined').length).toBe(1)
    expect(wrapper.find('.antdicon-MenuUnfoldOutlined').length).toBe(0)

    wrapper.find('.menu').simulate('click')
    expect(props.showLeft.mock.calls.length).toBe(1)
    expect(wrapper.find('.header').prop('className')).toBe('header collapse')
    expect(wrapper.find('.antdicon-MenuFoldOutlined').length).toBe(0)
    expect(wrapper.find('.antdicon-MenuUnfoldOutlined').length).toBe(1)
    wrapper.find('.menu').simulate('click')
    expect(props.showLeft.mock.calls.length).toBe(2)
    expect(wrapper.find('.header').prop('className')).toBe('header')
    expect(wrapper.find('.antdicon-MenuFoldOutlined').length).toBe(1)
    expect(wrapper.find('.antdicon-MenuUnfoldOutlined').length).toBe(0)
  })

  it('should change theme correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)
    const oldLocation = window.location
    delete window.location
    window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(oldLocation),
        search: {
          configurable: true,
          writable: true,
          value: ''
        }
      }
    )

    let wrapper = null
    const props = {
      ...DEFAULT_PROPS
    }

    wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.antd-radio-group').length).toBe(2)
    const fakeEvent = {
      target: {
        value: 'darkgray'
      }
    }
    wrapper.find('.antd-radio-group').at(0).prop('onChange')(fakeEvent)
    expect(window.location.search).toBe('theme=darkgray')

    window.location = oldLocation
  })

  it('should change locale correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)
    const oldLocation = window.location
    delete window.location
    window.location = Object.defineProperties(
      {},
      {
        ...Object.getOwnPropertyDescriptors(oldLocation),
        search: {
          configurable: true,
          writable: true,
          value: ''
        }
      }
    )

    let wrapper = null
    const props = {
      ...DEFAULT_PROPS
    }

    wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.locale .antd-menu-item').length).toBe(2)
    wrapper.find('.locale .antd-menu-item').at(1).simulate('click')
    expect(window.location.search).toBe('locale=zh-CN')
    wrapper.find('.locale .antd-menu-item').at(0).simulate('click')
    expect(window.location.search).toBe('locale=en')

    window.location = oldLocation
  })

  it('should open login modal correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)

    let wrapper = null

    const props = {
      ...DEFAULT_PROPS,
      AUTH: undefined,
      notify: jest.fn((compName, method, params) => {
        wrapper.setProps({
          childrenNotification: {
            [compName]: {
              method,
              params
            }
          }
        })
      })
    }

    wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.login .antd-button').length).toBe(1)
    wrapper.find('.login .antd-button').at(0).simulate('click')
    expect(props.notify.mock.calls.length).toBe(1)
    expect(props.notify.mock.calls[0]).toEqual(['loginModal', 'show', { visible: true }])
  })

  it('should logout correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)

    let wrapper = null

    const props = {
      ...DEFAULT_PROPS,
      logout: jest.fn()
    }

    wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.login .antd-menu-item').length).toBe(3)
    wrapper.find('.login .antd-menu-item').at(2).childAt(0).simulate('click')
    expect(props.logout.mock.calls.length).toBe(1)
  })

  it('should open profile modal correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)

    let wrapper = null

    const props = {
      ...DEFAULT_PROPS,
      notify: jest.fn((compName, method, params) => {
        wrapper.setProps({
          childrenNotification: {
            [compName]: {
              method,
              params
            }
          }
        })
      })
    }

    wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.login .antd-menu-item').length).toBe(3)
    wrapper.find('.login .antd-menu-item').at(1).childAt(0).simulate('click')
    expect(props.notify.mock.calls.length).toBe(1)
    expect(props.notify.mock.calls[0]).toEqual(['profileModal', 'show', { visible: true }])
  })

  it('should change layout correctly', async () => {
    const Header = await headerFactory(RB_CONTEXT)

    let wrapper = null
    const props = {
      ...DEFAULT_PROPS,
      setLayout: jest.fn((LAYOUT_MODE) => {
        wrapper.setProps({
          LAYOUT_MODE
        })
      })
    }

    wrapper = mount(<Header {...props} />)

    expect(wrapper.find('.antd-radio-group').length).toBe(2)
    const fakeEvent = {
      target: {
        value: 'top'
      }
    }
    wrapper.find('.antd-radio-group').at(1).prop('onChange')(fakeEvent)
    expect(wrapper.find('.header').prop('className')).toBe('header topMode')
    expect(wrapper.find('.menu').length).toBe(0)
  })
})
