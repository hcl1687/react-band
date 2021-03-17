import configFactory from '../config'

const config = configFactory()

describe('custom/as/asConstants/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
