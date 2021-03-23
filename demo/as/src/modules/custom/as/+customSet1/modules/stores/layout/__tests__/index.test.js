import module from '../index.entry'

const layoutFactory = module.entry
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

describe('custom/as/stores/layout', () => {
  it('should render correctly', async () => {
    const breadcrumb = await layoutFactory({})
    expect(breadcrumb).toMatchSnapshot()
  })
})
