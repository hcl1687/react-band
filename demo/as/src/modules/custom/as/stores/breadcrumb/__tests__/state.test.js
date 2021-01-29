import state from '../state'

describe('custom/as/stores/breadcrumb/state', () => {
  it('should render correctly', async () => {
    expect(state).toMatchSnapshot()
  })
})
