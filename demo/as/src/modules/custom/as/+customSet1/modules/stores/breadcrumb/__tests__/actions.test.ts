import actions from '../actions'

describe('custom/as/stores/breadcrumb/actions', () => {
  it('should render correctly', async () => {
    expect(actions).toMatchSnapshot()
  })

  it('check setBreadcrumb', async () => {
    const { setBreadcrumb } = actions
    expect(setBreadcrumb()).toEqual([])
    expect(setBreadcrumb([{
      name: 'xx',
      path: '/xx'
    }])).toEqual([{
      name: 'xx',
      path: '/xx'
    }])
  })
})
