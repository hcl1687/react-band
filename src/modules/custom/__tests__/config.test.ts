import configFactory from '../config'

const config = configFactory()

describe('custom/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
