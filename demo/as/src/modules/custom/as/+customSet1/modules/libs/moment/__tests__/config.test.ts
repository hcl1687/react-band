import configFactory from '../config'

const config = configFactory()

describe('custom/as/libs/moment/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
