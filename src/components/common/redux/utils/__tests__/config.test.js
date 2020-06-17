import configFactory from '../config'

const config = configFactory()

describe('common/redux/utils/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
