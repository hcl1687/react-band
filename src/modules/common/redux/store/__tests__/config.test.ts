import configFactory from '../config'

const config = configFactory()

describe('common/redux/store/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
