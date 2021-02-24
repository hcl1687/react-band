import authFactory from '../index.entry'

jest.mock('../actions', () => {
  return () => {
    return {}
  }
})
jest.mock('../state', () => {
  return () => {
    return {}
  }
})
jest.mock('../reducers', () => {
  return {}
})

describe('custom/as/stores/auth', () => {
  it('should render correctly', async () => {
    const RB_CONTEXT = {
      options: {},
      modules: {},
      i18ns: {},
      themes: {},
      packedModules: {},
      modulesConfig: {},
      routes: [],
      getModule: async (type: string) => {
        if (type === 'asUtils') {
          return {}
        }
      }
    }
    const auth = await authFactory(RB_CONTEXT)
    expect(auth).toMatchSnapshot()
  })
})
