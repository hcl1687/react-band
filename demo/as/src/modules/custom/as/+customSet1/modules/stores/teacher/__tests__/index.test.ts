import module from '../index.entry'

const teacherFactory = module.entry

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

describe('custom/as/stores/teacher', () => {
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
    const teacher = await teacherFactory(RB_CONTEXT)
    expect(teacher).toMatchSnapshot()
  })
})
