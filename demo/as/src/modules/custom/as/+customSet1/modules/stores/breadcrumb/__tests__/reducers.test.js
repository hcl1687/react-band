import reducers from '../reducers'

describe('custom/as/stores/breadcrumb/reducers', () => {
  it('should render correctly', () => {
    expect(reducers).toMatchSnapshot()
  })

  it('check setBreadcrumb', () => {
    const { setBreadcrumb: { next: nextFun } } = reducers
    expect(nextFun({}, {
      payload: [{
        name: 'test',
        path: '/test'
      }]
    })).toEqual({
      BREADCRUMBS: [{
        name: 'test',
        path: '/test'
      }]
    })
  })
})
