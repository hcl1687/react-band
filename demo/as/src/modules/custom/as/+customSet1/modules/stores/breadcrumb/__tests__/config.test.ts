import configFactory from '../config'

const config = configFactory()

describe('custom/as/stores/breadcrumb/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
