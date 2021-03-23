import module from '../index.entry'

const breadcrumbFactory = module.entry
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

describe('custom/as/stores/breadcrumb', () => {
  it('should render correctly', async () => {
    const breadcrumb = await breadcrumbFactory({})
    expect(breadcrumb).toMatchSnapshot()
  })
})
