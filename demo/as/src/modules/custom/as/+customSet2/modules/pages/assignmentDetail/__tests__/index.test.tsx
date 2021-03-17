import PropTypes, { InferProps } from 'prop-types'
import React, { Component } from 'react'
import assignmentDetailFactory from '../index.entry'
import { mount } from 'enzyme'
import tools from '~/../tests/utils'

const fakeValues = {
  name: 'test',
  CreatedTime: {
    valueOf: () => (0)
  },
  DeadlineTime: {
    valueOf: () => (0)
  }
}
function getQueryParams (qs = '') {
  qs = qs.split('+').join(' ')

  const params = {}
  const re = /[?&]?([^=]+)=([^&]*)/g
  let tokens = re.exec(qs)

  while (tokens) {
    const key = decodeURIComponent(tokens[1])
    const val = decodeURIComponent(tokens[2])
    params[key] = val
    tokens = re.exec(qs)
  }

  return params
}

const mockHistoryPush = jest.fn()
const mockGoBack = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    goBack: mockGoBack
  })
}))

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

        handleFinish = () => {
          this.props.onFinish(fakeValues)
        }

        render () {
          const { children, ...rest } = this.props
          return <div className='antd-form' data-props={rest}>
            {children}
            <span className='form-submit' onClick={this.handleFinish} />
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
      const InputNumber = (props) => <div className='antd-input-inputNumber' data-props={props} />

      const Spin = ({ children, ...rest }) => <div className='antd-spin' data-props={rest}>
        {children}
      </div>
      Spin.propTypes = {
        children: PropTypes.any
      }

      const DatePicker = (props) => <div className='antd-datePicker' data-props={props} />
      const Select = ({ children, ...rest }) => <div className='antd-select' data-props={rest}>
        { children }
      </div>
      Select.propTypes = {
        children: PropTypes.any
      }
      const Option = ({ children, ...rest }) => <div className='antd-select-option' data-props={rest}>
        { children }
      </div>
      Option.propTypes = {
        children: PropTypes.any
      }
      Select['Option'] = Option

      return {
        Button,
        Form,
        Input,
        InputNumber,
        Spin,
        DatePicker,
        Select,
        message
      }
    } else if (type === 'asUtils') {
      return {
        getQueryParams
      }
    } else if (type === 'moment') {
      return (d) => {
        return d
      }
    }
  }
}

const DEFAULT_PROPS = {
  __: (val: string) => (val),
  theme: {
    assignmentDetail: 'assignmentDetail',
    cancelBtn: 'cancelBtn'
  },
  assignment: {
    id: 'da1b68e5-f022-4906-9bbe-9b94d7bccde1',
    ActivityId: '5250f42a-a207-467b-b8b5-c4bbc3f626af',
    Version: 'f46abf7d-1eca-48c4-9921-058b7d9cc2d3',
    Name: 'test assignment',
    PlayType: 'HomeWork',
    Accuracy: null,
    UsersCount: 1,
    Questions: 6,
    CreatedTime: 1592988031,
    DeadlineTime: 1595606399
  },
  getAssignment: () => Promise.resolve(),
  editAssignment: () => Promise.resolve(),
  setBreadcrumb: () => {},
  multiview_actived: 'true'
}

describe('custom/as/pages/assignmentDetail', () => {
  it('should render correctly', async () => {
    const AssignmentDetail = await assignmentDetailFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      setBreadcrumb: jest.fn()
    }
    const wrapper = mount(<AssignmentDetail {...props} />)

    expect(wrapper.find('.assignmentDetail').length).toBe(1)
    expect(wrapper.find('.antd-spin').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(11)
    expect(wrapper.find('.antd-button').length).toBe(2)

    expect(wrapper.find('.antd-form').prop('data-props')['initialValues']).toEqual({
      id: 'da1b68e5-f022-4906-9bbe-9b94d7bccde1',
      ActivityId: '5250f42a-a207-467b-b8b5-c4bbc3f626af',
      Version: 'f46abf7d-1eca-48c4-9921-058b7d9cc2d3',
      Name: 'test assignment',
      PlayType: 'HomeWork',
      Accuracy: null,
      UsersCount: 1,
      Questions: 6,
      CreatedTime: 1592988031000,
      DeadlineTime: 1595606399000
    })

    const mockedSetBreadcrumb = props.setBreadcrumb as jest.Mock<void, [Array<BreadcrumbStore.IBreadcrumb>]>
    expect(mockedSetBreadcrumb.mock.calls.length).toBe(1)
    expect(mockedSetBreadcrumb.mock.calls[0][0]).toEqual([{
      name: 'assignment',
      path: 'assignment'
    }, {
      name: 'assignmentDetail',
      path: 'assignment'
    }])
  })

  it('should getDetail if id is changed', async () => {
    const AssignmentDetail = await assignmentDetailFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      getAssignment: jest.fn(() => Promise.resolve({})),
      location: {
        search: ''
      }
    }
    const wrapper = mount(<AssignmentDetail {...props} />)

    expect(wrapper.find('.assignmentDetail').length).toBe(1)
    expect(wrapper.find('.antd-spin').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(11)
    expect(wrapper.find('.antd-button').length).toBe(2)

    const mockedGetAssignment = props.getAssignment as jest.Mock<Promise<any>, [string?]>
    expect(mockedGetAssignment.mock.calls.length).toBe(0)
    wrapper.setProps({
      location: {
        search: 'id=xxx'
      }
    })

    wrapper.update()
    expect(mockedGetAssignment.mock.calls.length).toBe(1)
    expect(mockedGetAssignment.mock.calls[0][0]).toBe('xxx')
  })

  it('should go back', async () => {
    const AssignmentDetail = await assignmentDetailFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }
    const wrapper = mount(<AssignmentDetail {...props} />)

    expect(wrapper.find('.assignmentDetail').length).toBe(1)
    expect(wrapper.find('.antd-spin').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(11)
    expect(wrapper.find('.antd-button').length).toBe(2)

    expect(mockGoBack.mock.calls.length).toBe(0)
    wrapper.find('.cancelBtn').simulate('click')
    expect(mockGoBack.mock.calls.length).toBe(1)
  })

  it('check submit successfully', async () => {
    const AssignmentDetail = await assignmentDetailFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      editAssignment: jest.fn(() => Promise.resolve({})),
      location: {
        search: 'id=xxx'
      }
    }
    const wrapper = mount(<AssignmentDetail {...props} />)

    expect(wrapper.find('.assignmentDetail').length).toBe(1)
    expect(wrapper.find('.antd-spin').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(11)
    expect(wrapper.find('.antd-button').length).toBe(2)

    const mockedEditAssignment = props.editAssignment as jest.Mock<Promise<any>, []>
    expect(mockedEditAssignment.mock.calls.length).toBe(0)
    wrapper.find('.form-submit').simulate('click')

    return tools.delay(() => {
      wrapper.update()
      expect(mockedEditAssignment.mock.calls.length).toBe(1)
      expect(mockedEditAssignment.mock.calls[0]).toEqual(['xxx', {
        CreatedTime: 0,
        DeadlineTime: 0,
        name: 'test'
      }])
      expect(message.success.mock.calls[0][0]).toBe('success')
    }, 100)
  })

  it('check submit failed', async () => {
    const AssignmentDetail = await assignmentDetailFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      editAssignment: jest.fn(() => Promise.reject(new Error('failed'))),
      location: {
        search: 'id=xxx'
      }
    }
    const wrapper = mount(<AssignmentDetail {...props} />)

    expect(wrapper.find('.assignmentDetail').length).toBe(1)
    expect(wrapper.find('.antd-spin').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(11)
    expect(wrapper.find('.antd-button').length).toBe(2)

    const mockedEditAssignment = props.editAssignment as jest.Mock<Promise<any>, []>
    expect(mockedEditAssignment.mock.calls.length).toBe(0)
    wrapper.find('.form-submit').simulate('click')

    return tools.delay(() => {
      wrapper.update()
      expect(mockedEditAssignment.mock.calls.length).toBe(1)
      expect(mockedEditAssignment.mock.calls[0]).toEqual(['xxx', {
        CreatedTime: 0,
        DeadlineTime: 0,
        name: 'test'
      }])
      expect(message.error.mock.calls[0][0]).toBe('failed')
    }, 100)
  })

  it('check input number', async () => {
    const AssignmentDetail = await assignmentDetailFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }
    const wrapper = mount(<AssignmentDetail {...props} />)

    expect(wrapper.find('.assignmentDetail').length).toBe(1)
    expect(wrapper.find('.antd-spin').length).toBe(1)
    expect(wrapper.find('.antd-form').length).toBe(1)
    expect(wrapper.find('.antd-form-item').length).toBe(11)
    expect(wrapper.find('.antd-button').length).toBe(2)

    const formatter = wrapper.find('.antd-input-inputNumber').at(0).prop('data-props')['formatter']
    const parser = wrapper.find('.antd-input-inputNumber').at(0).prop('data-props')['parser']
    expect(formatter()).toBe('0%')
    expect(formatter(1)).toBe('1%')
    expect(parser('1%')).toBe('1')
  })
})
