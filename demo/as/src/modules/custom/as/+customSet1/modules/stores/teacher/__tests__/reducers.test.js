import reducers from '../reducers'

describe('custom/as/stores/teacher/reducers', () => {
  it('should render correctly', () => {
    expect(reducers).toMatchSnapshot()
  })

  it('check getTeacher', () => {
    const { getTeacher: { next: nextFun, throw: throwFun } } = reducers
    expect(nextFun({}, {
      payload: {
        id: 1,
        name: 'test'
      }
    })).toEqual({
      teacher: {
        id: 1,
        name: 'test'
      }
    })

    expect(throwFun({
      teacher: {}
    }, {})).toEqual({
      teacher: {}
    })
  })

  it('check editTeacher', () => {
    const { editTeacher: { next: nextFun, throw: throwFun } } = reducers
    expect(nextFun({}, {
      payload: {
        id: 1,
        name: 'test'
      }
    })).toEqual({
      teacher: {
        id: 1,
        name: 'test'
      }
    })

    expect(throwFun({
      teacher: {}
    }, {})).toEqual({
      teacher: {}
    })
  })
})
