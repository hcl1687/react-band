import configFactory from '../config'

const config = configFactory()

describe('custom/as/framework/breadcrumb/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
