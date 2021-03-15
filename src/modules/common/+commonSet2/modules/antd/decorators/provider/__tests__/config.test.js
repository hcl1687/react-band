import configFactory from '../config'

const config = configFactory()

describe('common/antd/provider/config', () => {
  it('should render correctly', () => {
    expect(config).toMatchSnapshot()
  })
})
