import stateFactory from '../state'

const RB_CONTEXT = {
  getModule: (type) => {
    if (type === 'asUtils') {
      return {
        getAuth: () => {
          return {}
        }
      }
    }
  }
}

describe('custom/as/stores/auth/state', () => {
  it('should render correctly', async () => {
    const state = await stateFactory(RB_CONTEXT)
    expect(state).toMatchSnapshot()
  })
})
