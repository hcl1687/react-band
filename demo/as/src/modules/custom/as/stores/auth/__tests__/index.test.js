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
    const auth = await authFactory({})
    expect(auth).toMatchSnapshot()
  })
})
