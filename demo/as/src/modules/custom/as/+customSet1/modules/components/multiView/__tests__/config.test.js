import configFactory from '../config'

const config = configFactory()

describe('custom/as/components/multiView/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
