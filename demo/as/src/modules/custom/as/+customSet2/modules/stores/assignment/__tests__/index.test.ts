import module from '../index.entry'

const assignmentFactory = module.entry

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

describe('custom/as/stores/assignment', () => {
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
    const assignment = await assignmentFactory(RB_CONTEXT)
    expect(assignment).toMatchSnapshot()
  })
})
