import PropTypes from 'prop-types'
import React from 'react'
import module from '../index.entry'
import { mount } from 'enzyme'

const assignmentFactory = module.entry
const RB_CONTEXT = {
  getModule: (type) => {
    if (type === 'antd') {
      const Table = ({ onChange, rowKey, columns, dataSource, ...rest }) => {
        return <div className='antd-table' data-props={rest}>
          {
            dataSource.map(data => {
              const key = rowKey(data)
              return <div key={key} className='table-row' data-key={key}>
                {
                  columns.map((col, i) => {
                    const render = col.render || (() => (data[col.dataIndex]))
                    return <span key={`${key}-${i}`} className='table-col'>{render(data[col.dataIndex], data)}</span>
                  })
                }
              </div>
            })
          }
          <span className='table-pagination' onClick={(e) => { e.stopPropagation(); onChange({ current: 1, pageSize: 10, total: 2 }) }} />
        </div>
      }
      Table.propTypes = {
        onChange: PropTypes.func,
        columns: PropTypes.any,
        rowKey: PropTypes.func,
        dataSource: PropTypes.any
      }

      return {
        Table
      }
    } else if (type === 'antdIcon') {
      const UnorderedListOutlined = ({ onClick, ...rest }) => <div className='antd-UnorderedListOutlined'
        onClick={(e) => { e.stopPropagation(); onClick() }} data-props={rest} />
      UnorderedListOutlined.propTypes = {
        onClick: PropTypes.func
      }

      return {
        UnorderedListOutlined
      }
    } else if (type === 'multiView') {
      const MultiView = ({ children, onChange, ...rest }) => <div className='multiview'
        onClick={() => { onChange(0) }} data-props={rest}>
        {children}
      </div>
      MultiView.propTypes = {
        children: PropTypes.any,
        onChange: PropTypes.func
      }

      return MultiView
    } else if (type === 'assignmentDetail') {
      return () => <div className='assignmentDetail' />
    } else if (type === 'moment') {
      return (d) => {
        return {
          unix: () => (d),
          format: () => (d)
        }
      }
    }
  }
}

const DEFAULT_PROPS = {
  __: (val) => (val),
  theme: {
    wrapper: 'wrapper'
  },
  assignments: [{
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
  }, {
    id: '3eaa92e8-1db7-4a66-baad-7e245b26689c',
    ActivityId: '7e22dcfd-01fa-4e93-aba1-f051669e30f5',
    Version: 'd8d23da5-630a-4bbd-939c-1348256e4f5b',
    Name: 'Activity-2',
    PlayType: 'SoloLive',
    Accuracy: null,
    UsersCount: 1,
    Questions: 3,
    CreatedTime: 0,
    DeadlineTime: 0
  }],
  getAssignmentList: () => Promise.resolve(),
  history: {}
}

describe('custom/as/pages/assignment', () => {
  it('should render correctly', async () => {
    const Assignment = await assignmentFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS
    }
    const wrapper = mount(<Assignment {...props} />)

    expect(wrapper.find('.wrapper').length).toBe(1)
    expect(wrapper.find('.antd-table').length).toBe(1)
    expect(wrapper.find('.table-row').length).toBe(2)
    expect(wrapper.find('.table-col').length).toBe(14)

    expect(wrapper.find('.table-row').at(0).find('.table-col').at(1).text()).toBe('test assignment')
    expect(wrapper.find('.table-row').at(1).find('.table-col').at(1).text()).toBe('Activity-2')
    expect(wrapper.find('.table-row').at(0).prop('data-key')).toBe('da1b68e5-f022-4906-9bbe-9b94d7bccde1')
    expect(wrapper.find('.table-row').at(1).find('.table-col').at(5).text()).toBe('')
    expect(wrapper.find('.table-row').at(1).find('.table-col').at(0).text()).toBe('Live')
  })

  it('should jump to detail view correctly', async () => {
    const Assignment = await assignmentFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      history: {
        push: jest.fn()
      }
    }
    const wrapper = mount(<Assignment {...props} />)

    expect(wrapper.find('.wrapper').length).toBe(1)
    expect(wrapper.find('.antd-table').length).toBe(1)
    expect(wrapper.find('.table-row').length).toBe(2)
    expect(wrapper.find('.table-col').length).toBe(14)

    expect(wrapper.find('.antd-UnorderedListOutlined').length).toBe(2)
    wrapper.find('.antd-UnorderedListOutlined').at(0).simulate('click')

    expect(props.history.push.mock.calls.length).toBe(1)
    expect(props.history.push.mock.calls[0][0]).toBe('assignment?view=detail&id=da1b68e5-f022-4906-9bbe-9b94d7bccde1')
  })

  it('check table change', async () => {
    const Assignment = await assignmentFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      getAssignmentList: jest.fn(() => Promise.resolve({}))
    }
    const wrapper = mount(<Assignment {...props} />)

    expect(wrapper.find('.wrapper').length).toBe(1)
    expect(wrapper.find('.antd-table').length).toBe(1)
    expect(wrapper.find('.table-row').length).toBe(2)
    expect(wrapper.find('.table-col').length).toBe(14)

    wrapper.find('.table-pagination').simulate('click')

    expect(props.getAssignmentList.mock.calls.length).toBe(2)
    expect(props.getAssignmentList.mock.calls[0][0]).toEqual({
      current: 1,
      pageSize: 10,
      total: 0
    })
    expect(props.getAssignmentList.mock.calls[1][0]).toEqual({
      current: 1,
      pageSize: 10,
      total: 2
    })
  })

  it('check multiview change', async () => {
    const Assignment = await assignmentFactory(RB_CONTEXT)
    const props = {
      ...DEFAULT_PROPS,
      getAssignmentList: jest.fn(() => Promise.resolve({}))
    }
    const wrapper = mount(<Assignment {...props} />)

    expect(wrapper.find('.wrapper').length).toBe(1)
    expect(wrapper.find('.antd-table').length).toBe(1)
    expect(wrapper.find('.table-row').length).toBe(2)
    expect(wrapper.find('.table-col').length).toBe(14)

    wrapper.find('.multiview').simulate('click')

    expect(props.getAssignmentList.mock.calls.length).toBe(2)
    expect(props.getAssignmentList.mock.calls[0][0]).toEqual({
      current: 1,
      pageSize: 10,
      total: 0
    })
    expect(props.getAssignmentList.mock.calls[1][0]).toEqual({
      current: 1,
      pageSize: 10,
      total: 0
    })
  })
})
