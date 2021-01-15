import configFactory from '../config'

const config = configFactory()

describe('custom/as/asUtils/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
