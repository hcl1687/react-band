import configFactory from '../config'

const config = configFactory()

describe('custom/as/framework/header/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
