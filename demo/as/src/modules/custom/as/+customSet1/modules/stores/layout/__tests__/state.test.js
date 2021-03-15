import state from '../state'

describe('custom/as/stores/layout/state', () => {
  it('should render correctly', async () => {
    expect(state).toMatchSnapshot()
  })
})
