import PropTypes, { InferProps } from 'prop-types'
import React, { Component, forwardRef, useImperativeHandle, useRef } from 'react'
import { mount } from 'enzyme'
import profileFactory from '../index.entry'
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

const message = {
  success: jest.fn(),
  error: jest.fn()
}

const RB_CONTEXT = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (type: string) => {
    if (type === 'antd') {
      const Button = ({ onClick, ...rest }) => <div className='antd-button' onClick={onClick} data-props={rest} />
      Button.propTypes = {
        onClick: PropTypes.func
      }

      class Form extends Component<InferProps<typeof Form.propTypes>> {
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

      const Item = ({ children, ...rest }) => <div className='antd-form-item' data-props={rest}>
        {children}
      </div>
      Item.propTypes = {
        children: PropTypes.any
      }
      Form['Item'] = Item
      Form['useForm'] = () => {
        return [{
          setFieldsValue: () => {},
          resetFields: () => {}
        }]
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

      const Spin = ({ children, ...rest }) => <div className='antd-spin' data-props={rest}>
        {children}
      </div>
      Spin.propTypes = {
        children: PropTypes.any
      }

      return {
        Button,
        Form,
        Input,
        Modal,
        Spin,
        message
      }
    }
  }
}

const DEFAULT_PROPS = {
  __: (val: string) => (val),
  theme: {
    profileModal: 'profileModal'
  },
  AUTH: {
    role: 'Teacher',
    uid: 'xxx'
  },
  teacher: {
    id: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
    userName: 'Janardan Behara',
    userId: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
    email: 'Grade1_Janardan@hcl1687.com',
    userType: 'Teacher',
    avatar: null
  },
  getTeacher: () => Promise.resolve(),
  editTeacher: () => {},
  setNotifyHandler: () => {}
}

describe('custom/as/framework/profile', () => {
  it('should render correctly', async () => {
    const Profile = await profileFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }
    const profileRef = React.createRef()
    const wrapper = mount(<Profile {...props} ref={profileRef} />)

    expect(wrapper.find('.profileModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(6)
    expect(wrapper.find('.antd-input').length).toBe(5)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.antd-modal').prop('data-props')['visible']).toBe(false)
    expect(wrapper.find('.antd-form').prop('data-props')['initialValues']).toEqual({
      id: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
      userName: 'Janardan Behara',
      userId: 'bc747106-df91-48c0-a0b8-15ac66b891a5',
      email: 'Grade1_Janardan@hcl1687.com',
      userType: 'Teacher',
      avatar: null
    })
  })

  it('should show correctly', async () => {
    const Profile = await profileFactory(RB_CONTEXT)
    const ProfileWithRef = handleRef(Profile)
    const props = {
      ...DEFAULT_PROPS,
      setNotifyHandler: (handlers, ref) => {
        useImperativeHandle(ref, () => (handlers))
      }
    }

    let visible = false
    const ProfileWrapper = (props) => {
      const profileRef = useRef<Profile.IProfileHandle>()
      const toggle = () => {
        visible = !visible
        profileRef.current.show({
          visible
        })
      }

      return <div>
        <ProfileWithRef {...props} ref={profileRef} />
        <div className='toggle' onClick={toggle} />
      </div>
    }
    const wrapper = mount(<ProfileWrapper {...props} />)

    expect(wrapper.find('.profileModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(6)
    expect(wrapper.find('.antd-input').length).toBe(5)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.toggle').length).toBe(1)
    expect(wrapper.find('.antd-modal').prop('data-props')['visible']).toBe(false)
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props')['visible']).toBe(true)
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props')['visible']).toBe(false)
  })

  it('should cancel correctly', async () => {
    const Profile = await profileFactory(RB_CONTEXT)
    const ProfileWithRef = handleRef(Profile)
    const props = {
      ...DEFAULT_PROPS,
      setNotifyHandler: (handlers, ref) => {
        useImperativeHandle(ref, () => (handlers))
      }
    }

    let visible = false
    const ProfileWrapper = (props) => {
      const profileRef = useRef<Profile.IProfileHandle>()
      const toggle = () => {
        visible = !visible
        profileRef.current.show({
          visible
        })
      }

      return <div>
        <ProfileWithRef {...props} ref={profileRef} />
        <div className='toggle' onClick={toggle} />
      </div>
    }
    const wrapper = mount(<ProfileWrapper {...props} />)

    expect(wrapper.find('.profileModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(6)
    expect(wrapper.find('.antd-input').length).toBe(5)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.toggle').length).toBe(1)
    expect(wrapper.find('.antd-modal').prop('data-props')['visible']).toBe(false)
    wrapper.find('.toggle').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props')['visible']).toBe(true)
    wrapper.find('.modal-close').simulate('click')
    expect(wrapper.find('.antd-modal').prop('data-props')['visible']).toBe(false)
    expect(wrapper.find('.antd-button').prop('data-props')['loading']).toBe(false)
  })

  it('check edit successfully', async () => {
    const Profile = await profileFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      editTeacher: jest.fn((uid) => Promise.resolve(uid))
    }
    const profileRef = React.createRef()
    const wrapper = mount(<Profile {...props} ref={profileRef} />)

    expect(wrapper.find('.profileModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(6)
    expect(wrapper.find('.antd-input').length).toBe(5)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.form-submit').length).toBe(1)
    wrapper.find('.form-submit').simulate('click')

    return tools.delay(() => {
      wrapper.update()
      const mockedEditTeacher = props.editTeacher as jest.Mock<Promise<any>, [string?]>
      expect(mockedEditTeacher.mock.calls.length).toBe(1)
      expect(mockedEditTeacher.mock.calls[0][0]).toBe('xxx')
      expect(message.success.mock.calls.length).toBe(1)
      expect(wrapper.find('.antd-button').prop('data-props')['loading']).toBe(false)
    }, 100)
  })

  it('check edit failed', async () => {
    const Profile = await profileFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      editTeacher: jest.fn(() => Promise.reject(new Error('failed')))
    }
    const profileRef = React.createRef()
    const wrapper = mount(<Profile {...props} ref={profileRef} />)

    expect(wrapper.find('.profileModal').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(6)
    expect(wrapper.find('.antd-input').length).toBe(5)
    expect(wrapper.find('.antd-button').length).toBe(1)

    expect(wrapper.find('.form-submit').length).toBe(1)
    wrapper.find('.form-submit').simulate('click')

    return tools.delay(() => {
      wrapper.update()
      const mockedEditTeacher = props.editTeacher as jest.Mock<Promise<Error>, [string?]>
      expect(mockedEditTeacher.mock.calls.length).toBe(1)
      expect(mockedEditTeacher.mock.calls[0][0]).toBe('xxx')
      expect(message.error.mock.calls.length).toBe(1)
      expect(message.error.mock.calls[0][0]).toBe('failed')
      expect(wrapper.find('.antd-button').prop('data-props')['loading']).toBe(false)
    }, 500)
  })
})
