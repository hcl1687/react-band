import configFactory from '../config'

const config = configFactory()

describe('common/utils/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
