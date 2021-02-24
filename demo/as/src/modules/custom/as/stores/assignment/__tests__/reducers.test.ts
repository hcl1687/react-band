import reducers from '../reducers'

describe('custom/as/stores/assignment/reducers', () => {
  it('should render correctly', () => {
    expect(reducers).toMatchSnapshot()
  })

  it('check getAssignmentList', () => {
    const { getAssignmentList: { next: nextFun, throw: throwFun } } = reducers
    expect(nextFun({}, {
      type: 'getAssignmentList',
      payload: {
        assignments: [{
          id: 1,
          name: 'test'
        }],
        count: 1
      }
    })).toEqual({
      assignments: [{
        id: 1,
        name: 'test'
      }],
      count: 1
    })

    expect(nextFun({}, {
      type: 'getAssignmentList',
      payload: {}
    })).toEqual({
      assignments: [],
      count: 0
    })

    expect(throwFun({
      assignments: [],
      count: 0
    }, {
      type: 'getAssignmentList'
    })).toEqual({
      assignments: [],
      count: 0
    })
  })

  it('check getAssignment', () => {
    const { getAssignment: { next: nextFun, throw: throwFun } } = reducers
    expect(nextFun({}, {
      type: 'getAssignment',
      payload: {
        id: 1,
        name: 'test'
      }
    })).toEqual({
      assignment: {
        id: 1,
        name: 'test'
      }
    })

    expect(throwFun({
      assignment: {}
    }, {
      type: 'getAssignment'
    })).toEqual({
      assignment: {}
    })
  })

  it('check editAssignment', () => {
    const { editAssignment: { next: nextFun, throw: throwFun } } = reducers
    expect(nextFun({}, {
      type: 'editAssignment'
    })).toEqual({})
    expect(throwFun({}, {
      type: 'editAssignment'
    })).toEqual({})
  })
})
