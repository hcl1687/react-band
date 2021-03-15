import React from 'react'
import { mount } from 'enzyme'
import userFactory from '../user'

jest.mock('../avatar', () => {
  return () => {
    return function avatar () {
      return <div>avatar</div>
    }
  }
})

describe('custom/as/framework/header/factories/user', () => {
  it('should render correctly', async () => {
    const User = await userFactory()
    const props = {
      theme: {
        user: 'user',
        name: 'name',
        description: 'description'
      },
      user: {
        userType: 'Teacher',
        userName: 'Test'
      }
    }

    const wrapper = mount(<User {...props} />)

    expect(wrapper.find('.user').length).toBe(1)
    expect(wrapper.find('.name').text()).toBe('Test')
    expect(wrapper.find('.description').text()).toBe('Teacher')
  })
})
