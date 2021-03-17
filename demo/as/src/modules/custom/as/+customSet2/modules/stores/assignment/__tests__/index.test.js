import assignmentFactory from '../index.entry'

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
    const assignment = await assignmentFactory({})
    expect(assignment).toMatchSnapshot()
  })
})
