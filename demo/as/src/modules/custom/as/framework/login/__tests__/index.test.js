import React, { Component, forwardRef, useImperativeHandle, useRef } from 'react'
import PropTypes from 'prop-types'
import loginFactory from '../index.entry'
import { mount } from 'enzyme'
import tools from '~/../tests/utils/index'

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

const RB_CONTEXT = {
  getModule: (type) => {
    if (type === 'antd') {
      const Button = ({ onClick, ...rest }) => <div className='antd-button' onClick={onClick} data-props={rest} />
      Button.propTypes = {
        onClick: PropTypes.func
      }

      class Form extends Component {
        static propTypes = {
          children: PropTypes.any,
          onFinish: PropTypes.func
        }

        resetFields () {
        }

        render () {
          const { children, onFinish, ...rest } = this.props
          return <div className='antd-form' data-props={rest}>
            {children}
            <span className='form-submit' onClick={onFinish} />
          </div>
        }
      }

      Form.Item = ({ children, ...rest }) => <div className='antd-form-item' data-props={rest}>
        {children}
      </div>
      Form.Item.propTypes = {
        children: PropTypes.any
      }

      const Input = (props) => <div className='antd-input' data-props={props} />
      Input.Password = (props) => <div className='antd-input-password' data-props={props} />

      const Modal = ({ children, onCancel, ...rest }) => <div className='antd-modal' data-props={rest}>
        {children}
        <span className='modal-close' onClick={onCancel} />
      </div>
      Modal.propTypes = {
        children: PropTypes.any,
        onCancel: PropTypes.any
      }

      return {
        Button,
        Form,
        Input,
        Modal
      }
    }
  }
}

const DEFAULT_PROPS = {
  __: (val) => (val),
  theme: {
    error: 'error',
    loginModal: 'loginModal'
  },
  login: () => {},
  getTeacher: () => {},
  setNotifyHandler: () => {}
}

describe('custom/as/framework/login', () => {
  it('should render correctly', async () => {
    const Login = await loginFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }
    const loginRef = React.createRef()
    const wrapper = mount(<Login {...props} ref={loginRef} />)

    expect(wrapper.find('.loginModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(4)
    expect(wrapper.find('.antd-input').length).toBe(1)
    expect(wrapper.find('.antd-input-password').length).toBe(1)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.antd-modal').prop('data-props').visible).toBe(false)
    expect(wrapper.find('.antd-form').prop('data-props').initialValues).toEqual({
      email: 'test@hcl1687.com',
      password: '123456'
    })
  })

  it('should show correctly', async () => {
    const Login = await loginFactory(RB_CONTEXT)
    const LoginWithRef = handleRef(Login)
    const props = {
      ...DEFAULT_PROPS,
      setNotifyHandler: (handlers, ref) => {
        useImperativeHandle(ref, () => (handlers))
      }
    }

    let visible = false
    const LoginWrapper = (props) => {
      const loginRef = useRef()
      const toggle = () => {
        visible = !visible
        loginRef.current.show({
          visible
        })
      }

      return <div>
        <LoginWithRef {...props} ref={loginRef} />
        <div className='toggle' onClick={toggle} />
      </div>
    }
    const wrapper = mount(<LoginWrapper {...props} />)

    expect(wrapper.find('.loginModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(4)
    expect(wrapper.find('.antd-input').length).toBe(1)
    expect(wrapper.find('.antd-input-password').length).toBe(1)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.toggle').length).toBe(1)
    expect(wrapper.find('.antd-modal').prop('data-props').visible).toBe(false)
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props').visible).toBe(true)
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props').visible).toBe(false)
  })

  it('should cancel correctly', async () => {
    const Login = await loginFactory(RB_CONTEXT)
    const LoginWithRef = handleRef(Login)
    const props = {
      ...DEFAULT_PROPS,
      setNotifyHandler: (handlers, ref) => {
        useImperativeHandle(ref, () => (handlers))
      }
    }

    let visible = false
    const LoginWrapper = (props) => {
      const loginRef = useRef()
      const toggle = () => {
        visible = !visible
        loginRef.current.show({
          visible
        })
      }

      return <div>
        <LoginWithRef {...props} ref={loginRef} />
        <div className='toggle' onClick={toggle} />
      </div>
    }
    const wrapper = mount(<LoginWrapper {...props} />)

    expect(wrapper.find('.loginModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(4)
    expect(wrapper.find('.antd-input').length).toBe(1)
    expect(wrapper.find('.antd-input-password').length).toBe(1)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.toggle').length).toBe(1)
    expect(wrapper.find('.antd-modal').prop('data-props').visible).toBe(false)
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props').visible).toBe(true)
    wrapper.find('.modal-close').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props').visible).toBe(false)
    expect(wrapper.find('.antd-button').prop('data-props').loading).toBe(false)
  })

  it('check login successfully', async () => {
    const Login = await loginFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      login: jest.fn(() => Promise.resolve({ role: 'Teacher', uid: 'xxx' })),
      getTeacher: jest.fn((uid) => Promise.resolve())
    }
    const loginRef = React.createRef()
    const wrapper = mount(<Login {...props} ref={loginRef} />)

    expect(wrapper.find('.loginModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(4)
    expect(wrapper.find('.antd-input').length).toBe(1)
    expect(wrapper.find('.antd-input-password').length).toBe(1)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.form-submit').length).toBe(1)
    wrapper.find('.form-submit').simulate('click')

    return tools.delay(() => {
      expect(props.login.mock.calls.length).toBe(1)
      expect(props.getTeacher.mock.calls.length).toBe(1)
      expect(props.getTeacher.mock.calls[0][0]).toBe('xxx')
    }, 100)
  })

  it('check login failed', async () => {
    const Login = await loginFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      login: jest.fn(() => Promise.reject(new Error('failed'))),
      getTeacher: jest.fn()
    }
    const loginRef = React.createRef()
    const wrapper = mount(<Login {...props} ref={loginRef} />)

    expect(wrapper.find('.loginModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(4)
    expect(wrapper.find('.antd-input').length).toBe(1)
    expect(wrapper.find('.antd-input-password').length).toBe(1)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.form-submit').length).toBe(1)
    wrapper.find('.form-submit').simulate('click')

    return tools.delay(() => {
      expect(wrapper.find('.antd-form-item').length).toBe(4)
      expect(wrapper.find('.error').length).toBe(1)
      expect(wrapper.find('.error').text()).toBe('failed')
      expect(props.login.mock.calls.length).toBe(1)
      expect(props.getTeacher.mock.calls.length).toBe(0)
    }, 500)
  })
})
