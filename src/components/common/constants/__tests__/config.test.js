import configFactory from '../config'

const config = configFactory()

describe('common/constants/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
