import configFactory from '../config'

const config = configFactory()

describe('custom/as/pages/home/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
