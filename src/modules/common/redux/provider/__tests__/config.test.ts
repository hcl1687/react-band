import configFactory from '../config'

const config = configFactory()

describe('common/redux/provider/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
