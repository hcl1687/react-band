import stateFactory from '../state'

describe('custom/as/stores/assignment/state', () => {
  it('should render correctly', async () => {
    const state = await stateFactory()
    expect(state).toMatchSnapshot()
  })
})
