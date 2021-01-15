import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import PropTypes from 'prop-types'
import menuFactory from '../index.entry'
import { mount } from 'enzyme'

function handleRef (WrappedComponent) {
  let propTypes
  let defaultProps
  if (WrappedComponent.propTypes) {
    propTypes = WrappedComponent.propTypes
    delete WrappedComponent.propTypes
  }
  if (WrappedComponent.defaultProps) {
    defaultProps = WrappedComponent.defaultProps
    delete WrappedComponent.defaultProps
  }

  const WrappedComponentWithRef = forwardRef(WrappedComponent)

  // fix: forwardRef render functions do not support propTypes or defaultProps
  // https://stackoverflow.com/questions/59716140/using-forwardref-with-proptypes-and-eslint
  if (propTypes) {
    WrappedComponentWithRef.propTypes = propTypes
  }
  if (defaultProps) {
    WrappedComponentWithRef.defaultProps = defaultProps
  }

  return WrappedComponentWithRef
}

const mockHistoryPush = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  }),
  useLocation: () => ({
    pathname: '/assignment'
  })
}))

jest.mock('../menus', () => {
  return [{
    path: '/',
    name: 'home',
    icon: 'HomeOutlined'
  }, {
    path: '/assignment',
    name: 'assignment',
    icon: 'AppstoreOutlined'
  }]
})

const RB_CONTEXT = {
  options: {
    theme: 'default'
  },
  getModule: (type) => {
    if (type === 'antd') {
      const Menu = ({ children, onClick, ...rest }) => <div className='antd-menu' data-props={rest}>
        {children}
        <span className='antd-menu-btn' onClick={() => { onClick({ key: '0' }) }} />
      </div>
      Menu.propTypes = {
        children: PropTypes.any,
        onClick: PropTypes.any
      }

      Menu.Item = ({ children, onClick, ...rest }) => <div className='antd-menu-item' onClick={onClick} data-props={rest}>{children}</div>
      Menu.Item.propTypes = {
        children: PropTypes.any,
        onClick: PropTypes.func
      }

      return {
        Menu
      }
    } else if (type === 'antdIcon') {
      return {
        HomeOutlined: (props) => <span className='antdicon-HomeOutlined' data-props={props} />,
        AppstoreOutlined: (props) => <span className='antdicon-AppstoreOutlined' data-props={props} />
      }
    }
  }
}

const DEFAULT_PROPS = {
  __: (val) => (val),
  theme: {
    menu: 'menu',
    menuIcon: 'menuIcon'
  },
  setNotifyHandler: () => {},
  expand: true
}

describe('custom/as/framework/menu', () => {
  it('should render correctly', async () => {
    const MenuComp = await menuFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }

    const wrapper = mount(<MenuComp {...props} />)

    expect(wrapper.find('.menu').length).toBe(1)
    expect(wrapper.find('.antd-menu').length).toBe(1)
    expect(wrapper.find('.antd-menu-item').length).toBe(2)

    expect(wrapper.find('.antd-menu').prop('data-props').inlineCollapsed).toBe(false)
    expect(wrapper.find('.antd-menu').prop('data-props').selectedKeys).toEqual(['1'])
    expect(wrapper.find('.menu').prop('style').display).toBe('block')
  })

  it('check click menu', async () => {
    const MenuComp = await menuFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }

    const wrapper = mount(<MenuComp {...props} />)

    expect(wrapper.find('.menu').length).toBe(1)
    expect(wrapper.find('.antd-menu').length).toBe(1)
    expect(wrapper.find('.antd-menu-btn').length).toBe(1)
    wrapper.find('.antd-menu-btn').simulate('click')

    expect(mockHistoryPush.mock.calls.length).toBe(1)
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/')
  })

  it('check dark theme', async () => {
    const MenuComp = await menuFactory({
      ...RB_CONTEXT,
      options: {
        theme: 'darkgray'
      }
    })
    const props = {
      ...DEFAULT_PROPS
    }

    const wrapper = mount(<MenuComp {...props} />)

    expect(wrapper.find('.menu').length).toBe(1)
    expect(wrapper.find('.antd-menu').length).toBe(1)
    expect(wrapper.find('.antd-menu').prop('data-props').theme).toBe('dark')
  })

  it('should toggle correctly', async () => {
    const MenuComp = await menuFactory(RB_CONTEXT)
    const MenuCompWithRef = handleRef(MenuComp)
    const props = {
      ...DEFAULT_PROPS,
      setNotifyHandler: (handlers, ref) => {
        useImperativeHandle(ref, () => (handlers))
      }
    }

    const MenuCompWrapper = (props) => {
      const menuRef = useRef()
      const toggle = () => {
        menuRef.current.toggleMenu()
      }

      return <div>
        <MenuCompWithRef {...props} ref={menuRef} />
        <div className='toggle' onClick={toggle} />
      </div>
    }
    const wrapper = mount(<MenuCompWrapper {...props} />)

    expect(wrapper.find('.menu').length).toBe(1)
    expect(wrapper.find('.menu').prop('style').display).toBe('block')

    expect(wrapper.find('.toggle').length).toBe(1)
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.menu').prop('style').display).toBe('none')
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.menu').prop('style').display).toBe('block')
  })
})
