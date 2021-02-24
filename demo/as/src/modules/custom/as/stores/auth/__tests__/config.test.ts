import configFactory from '../config'

const config = configFactory()

describe('custom/as/stores/auth/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
