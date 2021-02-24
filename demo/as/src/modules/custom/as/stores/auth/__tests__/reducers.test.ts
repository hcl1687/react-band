import reducers from '../reducers'

describe('custom/as/stores/auth/reducers', () => {
  it('should render correctly', () => {
    expect(reducers).toMatchSnapshot()
  })

  it('check login', () => {
    const { login: { next: nextFun, throw: throwFun } } = reducers
    expect(nextFun({}, {
      type: 'login',
      payload: {
        uid: 'xx',
        role: 'Teacher'
      }
    })).toEqual({
      AUTH: {
        uid: 'xx',
        role: 'Teacher'
      }
    })

    expect(throwFun({
      AUTH: {}
    }, {
      type: 'login'
    })).toEqual({
      AUTH: {}
    })
  })

  it('check logout', () => {
    const { logout: { next: nextFun } } = reducers
    expect(nextFun({
      AUTH: {
        uid: 'xx',
        role: 'Teacher'
      }
    }, {
      type: 'logout'
    })).toEqual({
      AUTH: {}
    })
  })
})
