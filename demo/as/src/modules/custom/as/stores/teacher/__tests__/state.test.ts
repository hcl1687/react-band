import stateFactory from '../state'

const RB_CONTEXT: RB.IRBContext = {
  options: {},
  modules: {},
  i18ns: {},
  themes: {},
  packedModules: {},
  modulesConfig: {},
  routes: [],
  getModule: async (type: string) => {
    if (type === 'asUtils') {
      return {
        getUser: () => {
          return {}
        }
      }
    }
  }
}

describe('custom/as/stores/teacher/state', () => {
  it('should render correctly', async () => {
    const state = await stateFactory(RB_CONTEXT)
    expect(state).toMatchSnapshot()
  })
})
