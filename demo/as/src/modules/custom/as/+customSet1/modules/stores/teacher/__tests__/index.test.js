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
    const teacher = await teacherFactory({})
    expect(teacher).toMatchSnapshot()
  })
})
